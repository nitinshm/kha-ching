import dayjs from 'dayjs';

import { tradingQueue } from '../../lib/queue';
import withSession from '../../lib/session';

export default withSession(async (req, res) => {
  const user = req.session.get('user');

  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  const {
    instruments,
    lots,
    maxSkewPercent,
    slmPercent,
    runAt,
    runNow,
    expireIfUnsuccessfulInMins,
    strategy,
    exitStrategy,
    targetStrategy
  } = req.body;

  console.log('create job request', req.body);

  const queueOptions = runNow
    ? {}
    : {
        delay: dayjs(runAt).diff(dayjs(), 'milliseconds')
      };

  const addToQueueResponses = await Promise.all(
    instruments.map((instrument) =>
      tradingQueue.add(
        `${strategy}_${instrument}_${dayjs().format()}`,
        {
          strategy,
          exitStrategy,
          targetStrategy,
          instrument,
          lots,
          maxSkewPercent,
          slmPercent,
          user,
          runAt,
          runNow,
          expiresAt: dayjs(runAt).add(expireIfUnsuccessfulInMins, 'minutes').format()
        },
        queueOptions
      )
    )
  );

  res.json(addToQueueResponses);
});
