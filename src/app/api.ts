import express from 'express';
import Joi from '@hapi/joi';
import {
  ContainerTypes,
  ValidatedRequest,
  ValidatedRequestSchema,
  createValidator,
  ExpressJoiError
} from 'express-joi-validation';

import { getDownloadLink } from '../utils/scrapping';
import { search, getDownloadPage } from '../utils/libgen';

let port = process.env.PORT;
if (port == null || port === '') {
  port = '8000';
}

const debug = require('debug')('express');

const app = express();
const validator = createValidator({ passError: true });

const querySchema = Joi.object({
  searchQuery: Joi.string()
    .required()
    .min(4),
  count: Joi.number()
    .max(20)
    .default(5),
  searchIn: Joi.string()
    .equal(
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
    .equal('title', 'publisher', 'year', 'pages', 'language', 'filesize', 'extension')
    .default('def'),
  offset: Joi.number().default(0)
});

interface CustomRequest extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    searchQuery: string;
    count: number;
    searchIn: string;
    reverse: boolean;
    sortBy: string;
    offset: number;
  };
}

debug('starting api in port %s', port);

app.get(
  '/search',
  validator.query(querySchema),
  async (req: ValidatedRequest<CustomRequest>, res: express.Response) => {
    debug(`${req.method} ${req.url}`);
    const data = await search(req.query);
    debug('sending results: %O', data);
    res.status(200).json({ data });
  }
);

app.get('/download/:md5?', async (req, res) => {
  debug(`${req.method} ${req.url}`);
  const { md5 } = req.params;
  const downladPageURL = await getDownloadPage(md5);
  debug('download page url: %s', downladPageURL);
  const downloadLink = await getDownloadLink(downladPageURL);
  debug('sending download link: %s', downloadLink);
  res.status(200).json({ data: { downloadLink } });
});

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
