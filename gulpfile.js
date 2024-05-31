import gulp from 'gulp';
import './gulp/dev.js'
import './gulp/docs.js'

//Tasks

gulp.task('default', gulp.series('clean:dev', gulp.parallel('html:dev', 'sass:dev', 'images:dev', 'fonts:dev', 'js:dev'), gulp.parallel('server:dev', 'watch:dev')));
gulp.task('docs', gulp.series('clean:docs', gulp.parallel('html:docs', 'sass:docs', 'images:docs', 'fonts:docs', 'js:docs'), gulp.parallel('server:docs')));