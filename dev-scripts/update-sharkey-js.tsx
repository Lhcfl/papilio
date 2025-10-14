import { StartDownloaderTui } from './tui/downloader';

// const promises = downloader({ 'packages/misskey-js/src': 'sharkey-js' });

// const res = await promises;
// const failed = res.flat().filter((x) => x.status === 'rejected');
// if (failed.length > 0) {
//   console.error(`${failed.length} files failed to download.`);
// }

StartDownloaderTui({
  'packages/misskey-js/src': 'sharkey-js',
});
