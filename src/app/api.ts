import express from 'express';
import Joi from '@hapi/joi';
import {
  ContainerTypes,
  ValidatedRequest,
  ValidatedRequestSchema,
  createValidator,
  ExpressJoiError
} from 'express-joi-validation';
import cors from 'cors';

import { getDownloadLink } from '../utils/scrapping';
import { search, getDownloadPage, getBookById } from '../utils/libgen';

let port = process.env.PORT;
if (port == null || port === '') {
  port = '8000';
}

const debug = require('debug')('express');

const app = express();
const validator = createValidator({ passError: true });

const searchQuerySchema = Joi.object({
  searchTerm: Joi.string()
    .required()
    .min(4),
  count: Joi.number()
    .max(20)
    .default(5),
  searchIn: Joi.string()
    .equal(
      'def',
      'title',
      'author',
      'series',
      'periodical',
      'publisher',
      'year',
      'identifier',
      'md5',
      'extension'
    )
    .default('def'),
  reverse: Joi.boolean().default(false),
  sortBy: Joi.string()
    .equal('def', 'title', 'publisher', 'year', 'pages', 'language', 'filesize', 'extension')
    .default('def'),
  offset: Joi.number().default(0)
});

const downloadQuerySchema = Joi.object({
  md5: Joi.string()
});

const getBookDetailsQuerySchema = Joi.object({
  id: Joi.number().required()
});

interface SearchRequest extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    searchTerm: string;
    count: number;
    searchIn: string;
    reverse: boolean;
    sortBy: string;
    offset: number;
  };
}

interface DownloadRequest extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    md5: string;
  };
}

interface DetailsRequest extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    id: number;
  };
}

debug('starting api in port %s', port);

app.use(cors());

app.get(
  '/search',
  validator.query(searchQuerySchema),
  async (req: ValidatedRequest<SearchRequest>, res: express.Response) => {
    debug(`${req.method} ${req.url}`);
    const data = await search(req.query);
    debug('sending results: %O', data);
    res.status(200).json({ data });
  }
);

app.get(
  '/details',
  validator.query(getBookDetailsQuerySchema),
  async (req: ValidatedRequest<DetailsRequest>, res: express.Response, next) => {
    debug(`${req.method} ${req.url}`);
    const data = await getBookById(req.query.id).catch(next);
    debug('sending book details: %O', data);
    res.status(200).json({ data });
  }
);

app.get(
  '/download',
  validator.query(downloadQuerySchema),
  async (req: ValidatedRequest<DownloadRequest>, res: express.Response, next) => {
    debug(`${req.method} ${req.url}`);
    const downloadPageURL = await getDownloadPage(req.query.md5).catch(next);
    debug('download page url: %s', downloadPageURL);
    if (downloadPageURL != '') {
      res.locals.downloadPageURL = downloadPageURL;
      next();
    } else {
      res.status(404).json({ error: 'resource not found' });
    }
  },
  async (req, res, next) => {
    const downloadLink = await getDownloadLink(res.locals.downloadPageURL).catch(next);
    debug('sending download link: %s', downloadLink);
    if (downloadLink != '') {
      res.status(200).json({ data: { downloadLink } });
    } else {
      res.status(404).json({ error: 'resource not found' });
    }
  }
);

app.use(
  (
    err: any | ExpressJoiError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // debug('CONTAINER TYPES: %O', ContainerTypes); FIX: ContainerTypes is undefined when accessed as an object
    // if (err && err.type in ContainerTypes) {
    //   const e: ExpressJoiError = err;
    //   res.status(400).end(`You submitted a bad ${e.type} paramater`);
    // } else {
    //   res.status(500).end('internal server error');
    // }

    if (err && err.error && err.error.isJoi) {
      res.status(400).json({
        type: err.type,
        error: err.error.toString()
      });
    } else {
      res.status(500).json({
        error: 'internal server error'
      });
    }
  }
);

app.listen(port, () => {
  debug(`listening http://localhost:${port}`);
});
