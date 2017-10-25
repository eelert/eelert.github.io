var gulp = require('gulp');
var archieml = require('archieml');
var fs = require('fs');
var google = require('googleapis');
var GoogleAuth = require('google-auth-library');
var pug = require('gulp-pug');
var runSeq = require('run-sequence');

gulp.task('default', function(done){
  runSeq('archie', 'pug', done);
});

gulp.task('archie', function(done){
  var fieldID = '1YN-PaSJTbZAvHs-esZgQTmjtsNntxQawHCcPVviam8k';
  var key = require('./service_account.json');

  var drive = google.drive('v3'), scope = ['https://www.googleapis.com/auth/drive'],
      jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, scope, null);


  jwtClient.authorize(function(err, tokens) { 
    if (err) { 
      console.log(err);
      done();
    }
    drive.files.export({ auth: jwtClient, mimeType: 'text/plain', fileId: fieldID }, function(err, res) {
      if (err) {
        console.log(err);
      } else { 
        fs.writeFileSync('./src/archie.json', JSON.stringify(archieml.load(res), null, 2));
      } 
      done();
    });
  });
});

gulp.task('pug', function(){

  var archie = require('./src/archie.json');

  var p = pug({
    locals: archie
  });

  return gulp.src('./src/index.pug')
             .pipe(p)
             .pipe(gulp.dest('.'));
})


