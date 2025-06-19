/* eslint-disable max-statements-per-line */

'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const theFile = path.join(__dirname, 'test-z-asset.css');
const theDirectory = __dirname;

function dumpError(error) {
  let s = error.message;
  if (s === 'Bad argument') {
    s = 'fd must be a file descriptor';
  } else if (s === 'EBADF, bad file descriptor' && error.syscall === 'fstat') {
    s = 'EBADF: bad file descriptor, fstat';
  } else if (s === 'EBADF, bad file descriptor') {
    s = 'EBADF: bad file descriptor';
  } else if (s === 'EBADF: bad file descriptor, close') {
    s = 'EBADF: bad file descriptor';
  } else if (s === 'EISDIR, illegal operation on a directory') {
    s = 'EISDIR: illegal operation on a directory, read';
  }
  console.log(s);
}

test01();

function test01() {
  console.log('<<< test01 >>>');

  fs.stat(theFile, function (error, stats) {
    console.log('fs.stat.error === null', error === null);
    console.log('stats.size', stats.size);
    fs.open(theFile, 'r', function (error2, fd) {
      console.log('fs.open.error2 === null', error2 === null);
      console.log('typeof fd', typeof fd);
      fs.fstat(fd, function (error3, fstats) {
        console.log('fs.fstat.error3 === null', error3 === null);
        console.log('fstats.size', fstats.size);
        const buffer = Buffer.alloc((stats.size / 2) | 0);
        fs.read(
          fd,
          buffer,
          0,
          buffer.length,
          null,
          function (error4, bytesRead, buffer2) {
            console.log('fs.read.error4 === null', error4 === null);
            console.log('buffer === buffer2', buffer === buffer2); // should be same instances
            const data2 = buffer2.toString('utf8', 0, buffer2.length);
            console.log('data2', data2);
            fs.close(fd, function (error5, wtf) {
              console.log('fs.close.error5 === null', error5 === null);
              console.log('typeof wtf', typeof wtf);
              fs.readFile(theFile, function (error6, buffer3) {
                console.log('fs.readFile.error6 === null', error6 === null);
                const data3 = buffer3.toString('utf8', 0, buffer3.length);
                console.log('data3', data3);
                const buffer4 = buffer3;
                fs.writeFile(theFile, buffer4, function (error7, wtf2) {
                  if (process.pkg) {
                    assert.strictEqual(typeof error7, 'object'); // TODO maybe code=EACCESS?
                  } else {
                    assert.strictEqual(error7, null);
                  }
                  console.log('typeof wtf2', typeof wtf2);
                  fs.readdir(theDirectory, function (error8, list) {
                    console.log('fs.readdir.error8 === null', error8 === null);
                    console.log('Array.isArray(list)', Array.isArray(list));
                    fs.exists(theFile, function (value, wtf3) {
                      console.log('value', value);
                      console.log('typeof wtf3', typeof wtf3);
                      fs.exists(theDirectory, function (value2, wtf4) {
                        console.log('value2', value2);
                        console.log('typeof wtf4', typeof wtf4);
                        fs.realpath(theFile, function (error9, real) {
                          console.log(
                            'fs.realpath.error9 === null',
                            error9 === null,
                          );
                          console.log('typeof real', typeof real);
                          test01e(fd);
                        });
                        console.log('after fs.realpath');
                      });
                      console.log('after fs.exists(theDirectory)');
                    });
                    console.log('after fs.exists(theFile)');
                  });
                  console.log('after fs.readdir');
                });
                console.log('after fs.writeFile');
              });
              console.log('after fs.readFile');
            });
            console.log('after fs.close');
          },
        );
        console.log('after fs.read');
      });
      console.log('after fs.fstat');
    });
    console.log('after fs.open');
  });
  console.log('after fs.stat');
}

function test01e(badFd) {
  console.log('<<< test01e >>>');

  fs.stat('notExists', function (error) {
    console.log('fs.stat.error.code', error.code);
    fs.open('notExists', 'r', function (error2, fd) {
      console.log('fs.open.error2.code', error2.code);
      fd = badFd;
      fs.fstat(fd, function (error3) {
        console.log('fs.fstat.error3.code', error3.code);
        const buffer = Buffer.alloc(1024);
        fs.read(
          fd,
          buffer,
          0,
          buffer.length,
          null,
          function (error4, bytesRead, buffer2) {
            console.log('fs.read.error4.code', error4.code);
            console.log('typeof bytesRead', typeof bytesRead);
            console.log('typeof buffer2', typeof buffer2);
            fs.close(fd, function (error5, wtf) {
              console.log('fs.close.error5.code', error5.code);
              console.log('typeof wtf', typeof wtf);
              fs.readFile(theDirectory, function (error6, buffer3) {
                console.log('fs.readFile.error6.code', error6.code);
                console.log('typeof buffer3', typeof buffer3);
                fs.readFile('notExists', function (error7, buffer4) {
                  console.log('fs.readFile.error7.code', error7.code);
                  console.log('typeof buffer4', typeof buffer4);
                  const buffer5 = Buffer.alloc(1024);
                  fs.writeFile(
                    theFile + '/canNotWrite',
                    buffer5,
                    function (error8, wtf2) {
                      assert(
                        error8.code === 'ENOENT' || error8.code === 'ENOTDIR',
                      );
                      console.log('typeof wtf2', typeof wtf2);
                      fs.readdir(theFile, function (error9, list) {
                        console.log('fs.readdir.error9.code', error9.code);
                        console.log('typeof list', typeof list);
                        fs.readdir('notExists', function (error10, list2) {
                          console.log('fs.readdir.error10.code', error10.code);
                          console.log('typeof list2', typeof list2);
                          fs.exists('notExists', function (value, wtf3) {
                            console.log('value', value);
                            console.log('typeof wtf3', typeof wtf3);
                            fs.realpath('notExists', function (error11, real) {
                              console.log(
                                'fs.realpath.error11.code',
                                error11.code,
                              );
                              console.log('typeof real', typeof real);
                              test02();
                            });
                            console.log('after fs.realpath');
                          });
                          console.log('after fs.exists');
                        });
                        console.log('after fs.readdir(notExists)');
                      });
                      console.log('after fs.readdir(theFile)');
                    },
                  );
                  console.log('after fs.writeFile');
                });
                console.log('after fs.readFile(notExists)');
              });
              console.log('after fs.readFile(theDirectory)');
            });
            console.log('after fs.close');
          },
        );
        console.log('after fs.read');
      });
      console.log('after fs.fstat');
    });
    console.log('after fs.open');
  });
  console.log('after fs.stat');
}

function test02() {
  console.log('<<< test02 >>>');

  const stats = fs.statSync(theFile);
  console.log('stats.size', stats.size);
  const fd = fs.openSync(theFile, 'r');
  const fstats = fs.fstatSync(fd);
  console.log('fstats.size', fstats.size);
  const buffer = Buffer.alloc(stats.size);
  const bytesRead = fs.readSync(fd, buffer, 0, buffer.length);
  console.log('bytesRead', bytesRead);
  const data = buffer.toString('utf8', 0, buffer.length);
  console.log('data', data);
  fs.closeSync(fd);
  test03();
}

function test03() {
  console.log('<<< test03 >>>');

  const stats = fs.statSync(theFile);
  console.log('stats.size', stats.size);
  const fd = fs.openSync(theFile, 'r');
  const fstats = fs.fstatSync(fd);
  console.log('fstats.size', fstats.size);
  const buffer = Buffer.alloc(6);
  let bytesRead = fs.readSync(fd, buffer, 0, 6);
  console.log('bytesRead_a', bytesRead, 'buffer', buffer[0], buffer[1]);
  bytesRead = fs.readSync(fd, buffer, 0, 6);
  console.log('bytesRead_b', bytesRead, 'buffer', buffer[0], buffer[1]);
  bytesRead = fs.readSync(fd, buffer, 1, 5);
  console.log('bytesRead_c', bytesRead, 'buffer', buffer[1], buffer[2]);
  try {
    bytesRead = fs.readSync(fd, buffer, 1, 6);
  } catch (error) {
    dumpError(error);
  }
  console.log('bytesRead_d', bytesRead, 'buffer', buffer[1], buffer[2]);
  bytesRead = fs.readSync(fd, buffer, 5, 1);
  console.log('bytesRead_e', bytesRead, 'buffer', buffer[4], buffer[5]);
  try {
    bytesRead = fs.readSync(fd, buffer, 6, 0);
  } catch (error) {
    dumpError(error);
  }
  console.log('bytesRead_f', bytesRead, 'buffer', buffer[4], buffer[5]);
  try {
    bytesRead = fs.readSync(fd, buffer, -1, 5);
  } catch (error) {
    dumpError(error);
  }
  console.log('bytesRead_g', bytesRead, 'buffer', buffer[4], buffer[5]);
  try {
    bytesRead = fs.readSync(fd, buffer, -1, 9);
  } catch (error) {
    dumpError(error);
  }
  console.log('bytesRead_h', bytesRead, 'buffer', buffer[4], buffer[5]);
  bytesRead = fs.readSync(fd, buffer, 0, 6);
  console.log('bytesRead_i', bytesRead, 'buffer', buffer[0], buffer[1]);
  bytesRead = fs.readSync(fd, buffer, 0, 6);
  console.log('bytesRead_j', bytesRead, 'buffer', buffer[0], buffer[1]);
  bytesRead = fs.readSync(fd, buffer, 0, 6);
  console.log('bytesRead_k', bytesRead, 'buffer', buffer[0], buffer[1]);
  bytesRead = fs.readSync(fd, buffer, 0, 6);
  console.log('bytesRead_l', bytesRead, 'buffer', buffer[0], buffer[1]);
  bytesRead = fs.readSync(fd, buffer, 0, 6);
  console.log('bytesRead_m', bytesRead, 'buffer', buffer[0], buffer[1]);
  bytesRead = fs.readSync(fd, buffer, 0, 6, 20);
  console.log('bytesRead_n', bytesRead, 'buffer', buffer[0], buffer[1]);
  bytesRead = fs.readSync(fd, buffer, 0, 6, 80);
  console.log('bytesRead_o', bytesRead, 'buffer', buffer[0], buffer[1]);
  // this does not work properly. TODO some rework of readFromSnapshot is needed
  // try { bytesRead = fs.readSync(fd, buffer, 424242, 1); } catch (error) { dumpError(error); }
  // console.log('bytesRead_p', bytesRead, 'buffer', buffer[0], buffer[1]);
  fs.closeSync(fd);
  test04();
}

function test04() {
  const stats = fs.statSync(theDirectory);
  console.log(stats.mode);
  const fd = fs.openSync(theDirectory, 'r');
  const fstats = fs.fstatSync(fd);
  console.log(fstats.mode);
  const buffer = Buffer.from([12, 34, 56, 78]);
  let bytesRead;
  try {
    bytesRead = fs.readSync(fd, buffer, 0, 6);
  } catch (error) {
    dumpError(error);
  }
  console.log(bytesRead, buffer[0], buffer[1]);
  try {
    bytesRead = fs.readSync(fd, buffer, 6, 0);
  } catch (error) {
    dumpError(error);
  }
  console.log(bytesRead, buffer[0], buffer[1]);
  try {
    bytesRead = fs.readSync(fd, buffer, -1, 3);
  } catch (error) {
    dumpError(error);
  }
  console.log(bytesRead, buffer[0], buffer[1]);
  try {
    bytesRead = fs.readSync(fd, buffer, 0, 4);
  } catch (error) {
    dumpError(error);
  }
  console.log(bytesRead, buffer[0], buffer[1]);
  fs.closeSync(fd);
  test05();
}

function test05() {
  const fd = 'incorrect fd as string';
  const buffer = Buffer.from([12, 34, 56, 78]);
  let bytesRead;
  try {
    bytesRead = fs.readSync(fd, buffer, 0, 6);
  } catch (error) {
    dumpError(error);
  }
  console.log(bytesRead, buffer[0], buffer[1]);
  try {
    console.log(fs.fstatSync(fd));
  } catch (error) {
    dumpError(error);
  }
  console.log(bytesRead, buffer[0], buffer[1]);
  try {
    fs.closeSync(fd);
  } catch (error) {
    dumpError(error);
  }
  test06();
}

function test06() {
  const fd = 7890;
  const buffer = Buffer.from([12, 34, 56, 78]);
  let bytesRead;
  try {
    bytesRead = fs.readSync(fd, buffer, 0, 6);
  } catch (error) {
    dumpError(error);
  }
  console.log(bytesRead, buffer[0], buffer[1]);
  try {
    console.log(fs.fstatSync(fd));
  } catch (error) {
    dumpError(error);
  }
  console.log(bytesRead, buffer[0], buffer[1]);
  try {
    fs.closeSync(fd);
    console.log('EBADF: bad file descriptor');
  } catch (error) {
    dumpError(error);
  }
  test07();
}

function test07() {
  console.log('before createReadStream');
  const rs = fs.createReadStream(theFile);
  console.log('after createReadStream');

  rs.on('open', function () {
    console.log('open');
  });

  rs.on('readable', function () {
    console.log('before read');
    let r = rs.read();
    console.log('after read');
    if (!r) {
      r = 'null';
    } else if (r.length >= 2) {
      console.log('length:', r.length);
      r = r[0].toString() + ', ' + r[1].toString();
    }
    console.log('readable:', r);
  });

  rs.on('end', function () {
    console.log('end');
  });
}
