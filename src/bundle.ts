// Webpack entry point.
//
// The stylesheet import lives here rather than in Fireworksify.ts so it stays
// out of the generated declarations: a `.d.ts` carrying `import './Fireworksify.css'`
// resolves to dist/types/Fireworksify.css for consumers, which does not exist.
// MiniCssExtractPlugin pulls the CSS out into its own file, so this import
// contributes nothing to the JavaScript bundle.
import './Fireworksify.css';

export { Fireworksify } from './Fireworksify';
