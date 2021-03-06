import { _ }                     from 'meteor/underscore';
import { Meteor }                from 'meteor/meteor';
import { LoggerMongo }           from 'meteor/ostrio:loggermongo';
import { Logger, LoggerMessage } from 'meteor/ostrio:logger';

const log         = new Logger();
const mongoLogger = (new LoggerMongo(log)).enable();

if (Meteor.isServer) {
  mongoLogger.collection.remove({});
}

Tinytest.addAsync('LoggerMessage Instance', (test, done) => {
  test.instanceOf(log.info('This is message "info"', {data: 'Sample data "info"'}, 'userId "info"'), LoggerMessage);
  test.instanceOf(log.debug('This is message "debug"', {data: 'Sample data "debug"'}, 'userId "debug"'), LoggerMessage);
  test.instanceOf(log.error('This is message "error"', {data: 'Sample data "error"'}, 'userId "error"'), LoggerMessage);
  test.instanceOf(log.fatal('This is message "fatal"', {data: 'Sample data "fatal"'}, 'userId "fatal"'), LoggerMessage);
  test.instanceOf(log.warn('This is message "warn"', {data: 'Sample data "warn"'}, 'userId "warn"'), LoggerMessage);
  test.instanceOf(log.trace('This is message "trace"', {data: 'Sample data "trace"'}, 'userId "trace"'), LoggerMessage);
  test.instanceOf(log._('This is message "_"', {data: 'Sample data "_"'}, 'userId "_"'), LoggerMessage);

  done();
});

Tinytest.addAsync('LoggerMessage#toString', (test, done) => {
  test.equal(log.info('This is message "info"', {data: 'Sample data "info"'}, 'userId "info"').toString(), '[This is message "info"] \r\nLevel: INFO; \r\nDetails: {"data":"Sample data \\"info\\""}; \r\nUserId: userId "info";');
  test.equal(log.debug('This is message "debug"', {data: 'Sample data "debug"'}, 'userId "debug"').toString(), '[This is message "debug"] \r\nLevel: DEBUG; \r\nDetails: {"data":"Sample data \\"debug\\""}; \r\nUserId: userId "debug";');
  test.equal(log.error('This is message "error"', {data: 'Sample data "error"'}, 'userId "error"').toString(), '[This is message "error"] \r\nLevel: ERROR; \r\nDetails: {"data":"Sample data \\"error\\""}; \r\nUserId: userId "error";');
  test.equal(log.fatal('This is message "fatal"', {data: 'Sample data "fatal"'}, 'userId "fatal"').toString(), '[This is message "fatal"] \r\nLevel: FATAL; \r\nDetails: {"data":"Sample data \\"fatal\\""}; \r\nUserId: userId "fatal";');
  test.equal(log.warn('This is message "warn"', {data: 'Sample data "warn"'}, 'userId "warn"').toString(), '[This is message "warn"] \r\nLevel: WARN; \r\nDetails: {"data":"Sample data \\"warn\\""}; \r\nUserId: userId "warn";');
  test.equal(log._('This is message "_"', {data: 'Sample data "_"'}, 'userId "_"').toString(), '[This is message "_"] \r\nLevel: LOG; \r\nDetails: {"data":"Sample data \\"_\\""}; \r\nUserId: userId "_";');

  done();
});

Tinytest.addAsync('Throw', (test, done) => {
  try {
    throw log.fatal('This is message "fatal"', {data: 'Sample data "fatal"'}, 'userId "fatal"');
  } catch (e) {
    test.instanceOf(e, LoggerMessage);
    test.equal(e.level, 'FATAL');
    test.equal(e.toString(), '[This is message "fatal"] \r\nLevel: FATAL; \r\nDetails: {"data":"Sample data \\"fatal\\""}; \r\nUserId: userId "fatal";');
  }

  done();
});

Tinytest.addAsync('Log a Number', (test, done) => {
  test.instanceOf(log.info(10, {data: 10}, 10), LoggerMessage);
  test.instanceOf(log.debug(20, {data: 20}, 20), LoggerMessage);
  test.instanceOf(log.error(30, {data: 30}, 30), LoggerMessage);
  test.instanceOf(log.fatal(40, {data: 40}, 40), LoggerMessage);
  test.instanceOf(log.warn(50, {data: 50}, 50), LoggerMessage);
  test.instanceOf(log.trace(60, {data: 60}, 60), LoggerMessage);
  test.instanceOf(log._(70, {data: 70}, 70), LoggerMessage);

  done();
});

Tinytest.addAsync('Trace', (test, done) => {
  if (Meteor.isServer) {
    test.isTrue(_.has(log.trace(602, {data: 602}, 602).details, 'stackTrace'));
    test.isTrue(_.has(log.trace(602, {data: 602}, 602).data, 'stackTrace'));
  } else {
    test.isTrue(true);
  }

  done();
});

Tinytest.addAsync('Check written data, without {data} [SERVER]', (test, done) => {
  if (Meteor.isServer) {
    log.info('cwdwods Test "info"');
    log.debug('cwdwods Test "debug"');
    log.error('cwdwods Test "error"');
    log.fatal('cwdwods Test "fatal"');
    log.warn('cwdwods Test "warn"');
    log.trace('cwdwods Test "trace"');
    log._('cwdwods Test "_"');

    Meteor.setTimeout(() => {
      test.isTrue(!!mongoLogger.collection.findOne({message: 'cwdwods Test "info"'}));
      test.isTrue(!!mongoLogger.collection.findOne({message: 'cwdwods Test "debug"'}));
      test.isTrue(!!mongoLogger.collection.findOne({message: 'cwdwods Test "error"'}));
      test.isTrue(!!mongoLogger.collection.findOne({message: 'cwdwods Test "fatal"'}));
      test.isTrue(!!mongoLogger.collection.findOne({message: 'cwdwods Test "warn"'}));
      test.isTrue(!!mongoLogger.collection.findOne({message: 'cwdwods Test "trace"'}));
      test.isTrue(!!mongoLogger.collection.findOne({message: 'cwdwods Test "trace"'}).additional.stackTrace);
      test.isTrue(!!mongoLogger.collection.findOne({message: 'cwdwods Test "_"'}));

      done();
    }, 1024);
  } else {
    test.isTrue(true);
    done();
  }
});

Tinytest.addAsync('Check written data, with {data} [SERVER]', (test, done) => {
  if (Meteor.isServer) {
    log.info(103, {data: 'cwdwds Test "info"'});
    log.debug(203, {data: 'cwdwds Test "debug"'});
    log.error(303, {data: 'cwdwds Test "error"'});
    log.fatal(403, {data: 'cwdwds Test "fatal"'});
    log.warn(503, {data: 'cwdwds Test "warn"'});
    log.trace(603, {data: 'cwdwds Test "trace"'});
    log._(703, {data: 'cwdwds Test "_"'});

    Meteor.setTimeout(() => {
      test.isTrue(!!mongoLogger.collection.findOne({'additional.data': 'cwdwds Test "info"'}), 'Data test: info');
      test.isTrue(!!mongoLogger.collection.findOne({message: 103}), 'Number test: 10');
      test.isTrue(!!mongoLogger.collection.findOne({'additional.data': 'cwdwds Test "debug"'}), 'Data test: debug');
      test.isTrue(!!mongoLogger.collection.findOne({message: 203}), 'Number test: 20');
      test.isTrue(!!mongoLogger.collection.findOne({'additional.data': 'cwdwds Test "error"'}), 'Data test: error');
      test.isTrue(!!mongoLogger.collection.findOne({message: 303}), 'Number test: 30');
      test.isTrue(!!mongoLogger.collection.findOne({'additional.data': 'cwdwds Test "fatal"'}), 'Data test: fatal');
      test.isTrue(!!mongoLogger.collection.findOne({message: 403}), 'Number test: 40');
      test.isTrue(!!mongoLogger.collection.findOne({'additional.data': 'cwdwds Test "warn"'}), 'Data test: warn');
      test.isTrue(!!mongoLogger.collection.findOne({message: 503}), 'Number test: 50');
      test.isTrue(!!mongoLogger.collection.findOne({'additional.data': 'cwdwds Test "trace"'}), 'Data test: trace');
      test.isTrue(!!mongoLogger.collection.findOne({message: 603}), 'Data test: stackTrace');
      test.isTrue(!!mongoLogger.collection.findOne({message: 603}).additional.stackTrace, 'Number test: 60');
      test.isTrue(!!mongoLogger.collection.findOne({'additional.data': 'cwdwds Test "_"'}), 'Data test: _');
      test.isTrue(!!mongoLogger.collection.findOne({message: 703}), 'Number test: 70');
      done();
    }, 1024);
  } else {
    test.isTrue(true);
    done();
  }
});


if (Meteor.isClient) {
  log.info('cwdwodfc2s Test "info"');
  log.debug('cwdwodfc2s Test "debug"');
  log.error('cwdwodfc2s Test "error"');
  log.fatal('cwdwodfc2s Test "fatal"');
  log.warn('cwdwodfc2s Test "warn"');
  log.trace('cwdwodfc2s Test "trace"');
  log._('cwdwodfc2s Test "_"');
}

Tinytest.addAsync('Check written data, without {data} [From CLIENT to SERVER]', (test, done) => {
  if (Meteor.isServer) {
    Meteor.setTimeout(() => {
      test.isTrue(!!mongoLogger.collection.findOne({message: 'cwdwodfc2s Test "info"'}));
      test.isTrue(!!mongoLogger.collection.findOne({message: 'cwdwodfc2s Test "debug"'}));
      test.isTrue(!!mongoLogger.collection.findOne({message: 'cwdwodfc2s Test "error"'}));
      test.isTrue(!!mongoLogger.collection.findOne({message: 'cwdwodfc2s Test "fatal"'}));
      test.isTrue(!!mongoLogger.collection.findOne({message: 'cwdwodfc2s Test "warn"'}));
      test.isTrue(!!mongoLogger.collection.findOne({message: 'cwdwodfc2s Test "trace"'}));
      test.isTrue(!!mongoLogger.collection.findOne({message: 'cwdwodfc2s Test "trace"'}).additional.stackTrace);
      test.isTrue(!!mongoLogger.collection.findOne({message: 'cwdwodfc2s Test "_"'}));
      done();
    }, 2048);
  } else {
    test.isTrue(true);
    done();
  }
});

if (Meteor.isClient) {
  log.info(100, {data: 'cwdwdfc2s Test "info"'});
  log.debug(200, {data: 'cwdwdfc2s Test "debug"'});
  log.error(300, {data: 'cwdwdfc2s Test "error"'});
  log.fatal(400, {data: 'cwdwdfc2s Test "fatal"'});
  log.warn(500, {data: 'cwdwdfc2s Test "warn"'});
  log.trace(600, {data: 'cwdwdfc2s Test "trace"'});
  log._(700, {data: 'cwdwdfc2s Test "_"'});
}

Tinytest.addAsync('Check written data, with data [From CLIENT to SERVER]', (test, done) => {
  if (Meteor.isServer) {
    Meteor.setTimeout(() => {
      test.isTrue(!!mongoLogger.collection.findOne({'additional.data': 'cwdwdfc2s Test "info"'}), 'Data test: info');
      test.isTrue(!!mongoLogger.collection.findOne({message: 100}), 'Number test: 10');
      test.isTrue(!!mongoLogger.collection.findOne({'additional.data': 'cwdwdfc2s Test "debug"'}), 'Data test: debug');
      test.isTrue(!!mongoLogger.collection.findOne({message: 200}), 'Number test: 20');
      test.isTrue(!!mongoLogger.collection.findOne({'additional.data': 'cwdwdfc2s Test "error"'}), 'Data test: error');
      test.isTrue(!!mongoLogger.collection.findOne({message: 300}), 'Number test: 30');
      test.isTrue(!!mongoLogger.collection.findOne({'additional.data': 'cwdwdfc2s Test "fatal"'}), 'Data test: fatal');
      test.isTrue(!!mongoLogger.collection.findOne({message: 400}), 'Number test: 40');
      test.isTrue(!!mongoLogger.collection.findOne({'additional.data': 'cwdwdfc2s Test "warn"'}), 'Data test: warn');
      test.isTrue(!!mongoLogger.collection.findOne({message: 500}), 'Number test: 50');
      test.isTrue(!!mongoLogger.collection.findOne({'additional.data': 'cwdwdfc2s Test "trace"'}), 'Data test: trace');
      test.isTrue(!!mongoLogger.collection.findOne({'additional.data': 'cwdwdfc2s Test "trace"'}).additional.stackTrace);
      test.isTrue(!!mongoLogger.collection.findOne({message: 600}), 'Number test: 60');
      test.isTrue(!!mongoLogger.collection.findOne({'additional.data': 'cwdwdfc2s Test "_"'}), 'Data test: _');
      test.isTrue(!!mongoLogger.collection.findOne({message: 700}), 'Number test: 70');
      done();
    }, 2048);
  } else {
    test.isTrue(true);
    done();
  }
});
