'use strict';
require('shelljs/global');

let src = '/home/spencer/nlp/efrt/builds/efrt.js';
let out = '/home/spencer/nlp/efrt/builds/helloCompiled.js';

let cmd = 'java -jar /home/spencer/apps/closure-compiler/closure-compiler-v20170218.jar ';
cmd += ' --js  ' + src;
cmd += ' --js_output_file ' + out;
cmd += ' --compilation_level ADVANCED';
cmd += ' --language_out ECMASCRIPT5';
cmd += ' --formatting PRETTY_PRINT';
exec(cmd);
