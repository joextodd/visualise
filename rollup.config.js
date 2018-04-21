// Rollup plugins
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';

// PostCSS plugins
import nested from 'postcss-nested';

// Bundle Analysis
import sizes from 'rollup-plugin-sizes';

export default {
  entry: 'src/main.js',
  dest: 'build/main.js',
  format: 'iife',
  sourceMap: false,
  useStrict: false,
  plugins: [
    postcss({
      plugins: [nested()],
      extensions: ['.scss'],
    }),
    resolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
      extensions: ['.js']
    }),
    commonjs(),
    (process.env.NODE_ENV === 'prod' && babel({ exclude: ['node_modules/**', 'src/**/*.scss'] })),
    (process.env.NODE_ENV === 'prod' && uglify()),
    (process.env.NODE_ENV === 'prod' && sizes({ details: true }))
  ],
}