// Rollup plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';

// PostCSS plugins
import nested from 'postcss-nested';

// Bundle Analysis
import sizes from 'rollup-plugin-sizes';

// https://github.com/mrdoob/three.js/blob/dev/rollup.config.js
function glsl(){
  return {
    transform(code, id){
      if (!/\.glsl$/.test(id)){
        return;
      }
      return 'export default ' + JSON.stringify(
        code
        .replace(/[ \t]*\/\/.*\n/g, '')
        .replace(/[ \t]*\/\*[\s\S]*?\*\//g, '')
        .replace(/\n{2,}/g, '\n')
      ) + ';';
    }
  };
}

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
    glsl(),
    commonjs(),
    (process.env.NODE_ENV === 'prod' && eslint({ exclude: ['src/**/*.scss'] })),
    (process.env.NODE_ENV === 'prod' && babel({ exclude: ['node_modules/**', 'src/**/*.scss'] })),
    (process.env.NODE_ENV === 'prod' && uglify()),
    (process.env.NODE_ENV === 'prod' && sizes({ details: true }))
  ],
}