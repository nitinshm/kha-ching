import { Worker } from 'bullmq';

import { STRATEGIES } from '../constants';
import { addToNextQueue, redisConnection, TRADING_Q_NAME } from '../queue';
import atmStraddle from '../strategies/atmStraddle';
import wedThurs from '../strategies/wedThurs';

async function processJob(job) {
  const {
    data: { strategy, ...jobProps }
  } = job;
  switch (strategy) {
    case STRATEGIES.ATM_STRADDLE: {
      const result = await atmStraddle(jobProps);
      return result;
    }
    case STRATEGIES.CM_WED_THURS: {
      const result = await wedThurs(jobProps);
      return result;
    }
    default: {
      return null;
    }
  }
}

const worker = new Worker(
  TRADING_Q_NAME,
  async (job) => {
    console.log(`processing tradingQueue id ${job.id}`, job.data);
    const result = await processJob(job);
    console.log(`successfully processed tradingQueue id ${job.id}`, result);
    return result;
  },
  {
    connection: redisConnection,
    concurrency: 20
  }
);

worker.on('completed', async (job) => {
  // job has completed
  console.log('inside worker completed event');
  const { data, returnvalue } = job;
  if (job.returnvalue?.__nextTradingQueue) {
    await addToNextQueue(data, returnvalue);
  }
});
