// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
	input: 'index.mjs',
	output: {
		file: 'dist/nighthawk.mjs',
		format: 'esm'
	},
	plugins: [ commonjs(), resolve() ]
};
