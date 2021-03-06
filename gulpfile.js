var gulp = require("gulp");
var path = require("path");
var rename = require("gulp-rename");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var changed = require("gulp-changed");
var autoprefixer = require("autoprefixer");
var clear = require("gulp-clean");
var del = require("del");
var jsonTransform = require("gulp-json-transform");
var projectConfig = require("./package.json");

//项目路径
var option = {
  base: "src",
  allowEmpty: true
};
var dist = __dirname + "/dist";
var copyPath = ["src/**/!(_)*.*", "!src/**/*.less", "!src/**/*.ts"];
var lessPath = ["src/**/*.less", "src/app.less"];
var watchLessPath = ["src/**/*.less", "src/css/**/*.less", "src/app.less"];

//清空目录
gulp.task("clear", () => {
  return gulp.src(dist, {
    allowEmpty: true
  }).pipe(clear());
});

//复制不包含less和图片的文件
gulp.task("copy", () => {
  return gulp.src(copyPath, option).pipe(gulp.dest(dist));
});

//复制不包含less和图片的文件(只改动有变动的文件）
gulp.task("copyChange", () => {
  return gulp
    .src(copyPath, option)
    .pipe(changed(dist))
    .pipe(gulp.dest(dist));
});

// 增加dependencies
var dependencies = projectConfig && projectConfig.dependencies; // dependencies配置
var nodeModulesCopyPath = [];
for (let d in dependencies) {
  nodeModulesCopyPath.push("node_modules/" + d + "/**/*");
}

//项目路径
var copyNodeModuleOption = {
  base: ".",
  allowEmpty: true
};

//复制依赖的node_modules文件
gulp.task("copyNodeModules", () => {
  return gulp
    .src(nodeModulesCopyPath, copyNodeModuleOption)
    .pipe(gulp.dest(dist));
});

//复制依赖的node_modules文件(只改动有变动的文件）
gulp.task("copyNodeModulesChange", () => {
  return gulp
    .src(nodeModulesCopyPath, copyNodeModuleOption)
    .pipe(changed(dist))
    .pipe(gulp.dest(dist));
});

// 根据denpende生成package.json
gulp.task("generatePackageJson", () => {
  return gulp
    .src("./package.json")
    .pipe(
      jsonTransform(function (data, file) {
        return {
          dependencies: dependencies
        };
      })
    )
    .pipe(gulp.dest("dist"));
});

//编译less
gulp.task("less", () => {
  return gulp
    .src(lessPath, option)
    .pipe(
      less().on("error", function (e) {
        console.error(e.message);
        this.emit("end");
      })
    )
    .pipe(postcss([autoprefixer]))
    .pipe(
      rename(function (path) {
        path.extname = ".wxss";
      })
    )
    .pipe(gulp.dest(dist));
});

//编译less(只改动有变动的文件）
gulp.task("lessChange", () => {
  return gulp
    .src(lessPath, option)
    .pipe(changed(dist))
    .pipe(
      less().on("error", function (e) {
        console.error(e.message);
        this.emit("end");
      })
    )
    .pipe(postcss([autoprefixer]))
    .pipe(
      rename(function (path) {
        path.extname = ".wxss";
      })
    )
    .pipe(gulp.dest(dist));
});

//监听
gulp.task("watch", () => {
  var watcher = gulp.watch(copyPath, gulp.series("copyChange"));
  gulp.watch(nodeModulesCopyPath, gulp.series("copyNodeModulesChange"));
  gulp.watch(watchLessPath, gulp.series("less")); //Change
  watcher.on("change", function (event) {
    if (event.type === "deleted") {
      var filepath = event.path;
      var filePathFromSrc = path.relative(path.resolve("src"), filepath);
      // Concatenating the 'build' absolute path used by gulp.dest in the scripts task
      var destFilePath = path.resolve("dist", filePathFromSrc);
      // console.log({filepath, filePathFromSrc, destFilePath})
      del.sync(destFilePath);
    }
  });
});

//开发并监听
gulp.task(
  "default",
  gulp.series(
    // sync
    gulp.parallel(
      "copyChange",
      "copyNodeModulesChange",
      "generatePackageJson",
      "lessChange"
    ),
    "watch"
  )
);

//上线
gulp.task(
  "build",
  gulp.series(
    // sync
    "clear",
    gulp.parallel(
      // async
      "copy",
      "copyNodeModules",
      "generatePackageJson",
      "less"
    )
  )
);