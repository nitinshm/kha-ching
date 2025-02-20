import { Link } from '@material-ui/core';
import { useRouter } from 'next/router';

import Layout from '../../components/Layout';
import StratLayout from '../../components/StratLayout';
import TradeSetup from '../../components/trades/TradeSetup';
import { EXIT_STRATEGIES, INSTRUMENTS, STRATEGIES } from '../../lib/constants';

const TWELVE_THIRTY_TRADE_LS_KEY = 'khaching/trades/1230';
const WED_THURS_TRADE_LS_KEY = 'khaching/trades/wed_thurs';

const Strategy = () => {
  const router = useRouter();
  const { strategy } = router.query;

  switch (strategy) {
    case 'straddle': {
      return (
        <StratLayout>
          <TradeSetup
            LOCALSTORAGE_KEY={TWELVE_THIRTY_TRADE_LS_KEY}
            strategy={STRATEGIES.ATM_STRADDLE}
            enabledInstruments={[INSTRUMENTS.NIFTY, INSTRUMENTS.BANKNIFTY]}
            exitStrategies={[
              EXIT_STRATEGIES.INDIVIDUAL_LEG_SLM_1X,
              EXIT_STRATEGIES.INDIVIDUAL_LEG_SLM_2X,
              EXIT_STRATEGIES.MULTI_LEG_PREMIUM_THRESHOLD
            ]}
          />
        </StratLayout>
      );
    }
    case 'cm-wed-thurs': {
      return (
        <StratLayout>
          <TradeSetup
            LOCALSTORAGE_KEY={WED_THURS_TRADE_LS_KEY}
            strategy={STRATEGIES.CM_WED_THURS}
            enabledInstruments={[INSTRUMENTS.NIFTY]}
            exitStrategies={[EXIT_STRATEGIES.INDIVIDUAL_LEG_SLM_1X]}
          />
        </StratLayout>
      );
    }
    default: {
      return (
        <Layout>
          <Link href="/dashboard">Nothing here. Go back to dashboard!</Link>
        </Layout>
      );
    }
  }
};

export default Strategy;
