import {Composition} from 'remotion';
import {QuadPromo, DURATION} from './QuadPromo';
import {QuadPromoVertical} from './QuadPromoVertical';
export const Root = () => (
  <>
    <Composition id="QuadPromo" component={QuadPromo} durationInFrames={DURATION} fps={30} width={1920} height={1080} />
    <Composition id="QuadPromoVertical" component={QuadPromoVertical} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
  </>
);
