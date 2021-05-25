import express from 'express';
import Joi from '@hapi/joi';
import {
  ContainerTypes,
  ValidatedRequest,
  ValidatedRequestSchema,
  createValidator
} from 'express-joi-validation';

import { getDownloadPage } from '../../utils/libgen';
import { getDownloadLinksList } from '../../utils/scrapping';

const debug = require('debug')('express');

const validator = createValidator({ passError: true });

const downloadQuerySchema = Joi.object({
  md5: Joi.string(),
  downloadPageURL: Joi.string()
});

interface DownloadRequest extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    md5: string;
    downloadPageURL: string;
  };
}

const v2Router = express.Router();

v2Router.get(
  '/download_links',
  validator.query(downloadQuerySchema),
  async (req: ValidatedRequest<DownloadRequest>, res: express.Response, next) => {
    debug(`${req.method} ${req.url}`);
    if (req.query.downloadPageURL) {
      debug('using download page url: %s', req.query.downloadPageURL);
      res.locals.downloadPageURL = req.query.downloadPageURL;
      return next();
    }
    const { downloadPageURL, error } = await getDownloadPage(req.query.md5);
    if (error) return next(error);
    if (res.statusCode == 503) {
      debug('request finished with timeout; preventing continuing with the flow');
      return;
    }
    debug('using download page url: %s', downloadPageURL);
    res.locals.downloadPageURL = downloadPageURL;
    next();
  },
  async (_req, res, next) => {
    const { downloadLinks, error } = await getDownloadLinksList(res.locals.downloadPageURL);
    if (error) return next(error);
    if (res.statusCode == 503) {
      debug('request finished with timeout; preventing continuing with the flow');
      return;
    }
    debug('sending download links: %O', downloadLinks);
    res.status(200).json({ data: downloadLinks });
  }
);

export default v2Router;
