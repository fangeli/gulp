// Gulpfile

var gulp = require('gulp');

//node C:\src\RulesEngine\test-directory\node_modules\gulp\bin\gulp default

var scp = require('gulp-scp2');

//---------------
//copia
//---------------
gulp.task('copy1020', function() {
  return gulp.src('**/*.js')
  .pipe(scp({
    host: '192.168.10.12',
    username: 'administrator',
    password: 'Divitech2017',
    dest: '/testfabio/'
  }))
  .on('error', function(err) {
    console.log(err);
  });
});

//--------------------
//copiare dentro la cartella C
//--------------------
gulp.task('copy3050', function() {
  return gulp.src('**/*.js')
  .pipe(scp({
    host: '192.168.30.50',
    username: 'dpangallo',
    password: 'P@55word4',
    dest: '/testfabio/'
  }))
  .on('error', function(err) {
    console.log(err);
  });
});


//--------------------
//copiare dentro la cartella D
//--------------------
gulp.task('copy3050_d', function() {
  return gulp.src('**/*.js')
  .pipe(scp({
    host: '192.168.30.50',
    username: 'dpangallo',
    password: 'P@55word4',
    dest: 'd:/testfabio/'
  }))
  .on('error', function(err) {
    console.log(err);
  });
});


//--------------------
//checkout
//--------------------
gulp.task('checkout', async function() {
	var svnUltimate = require('node-svn-ultimate');
	svnUltimate.commands.checkout( 'http://192.168.0.10/svn/divi/RulesEngine/RulesEngineAPI', 'test', function( err ) {
    console.log( "Checkout complete" );
} );
});


var fs = require('fs');

var GulpSSH = require('gulp-ssh');

var config = {
  host: '192.168.10.12',
  port: 22,
  username: 'administrator',  
  password: 'Divitech2017'
}
 

var gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config
})


gulp.task('bbb', async function () {
  return gulp.src('index.html')
    .pipe(gulpSSH.sftp('write', '/TEMP/test.html'))
	.on('error', function(err) {
    console.log("fabio: " + err);
  });
})


gulp.task('ddd', async function () {
  return gulp.src('index.html')
    .pipe(gulpSSH.shell('cd /TEMP'))
	.on('error', function(err) {
    console.log("fabio: " + err);
  });
})


gulp.task('ccc', async function () {
  return gulpSSH
    .shell(['cd /TEMP', 'npm install'], {filePath: 'shell.log'})
    .pipe(gulp.dest('logs'))
})