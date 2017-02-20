'use strict';

const logger = require('utils/logger').utils,
    config = require('utils/config'),
    promise = require('utils/promise'),
    path = require('path'),
    EmailTemplate = require('email-templates').EmailTemplate,
    transport = promise.promisifyAll(require('nodemailer').createTransport(config.get('email:options'))),
    templatesDir = path.resolve(__dirname, '../templates'),
    templatesCache = {},
    _ = require('lodash');

/**
 * Sends an email based on template.
 *
 * Subject and content must be defined as template in 'templates' folder.
 * Additional node-mailer options like, cc, bcc and etc can be defined in config with 'email:defaults' path.
 *
 * @param template template folder inside templates folder
 * @param to list of recepients in 'bar@blurdybloop.com, baz@blurdybloop.com' format
 * @param data to render template
 * @returns {*}
 */
async function send(template, to, data) {
    logger.debug('mailer.send', JSON.stringify(template), JSON.stringify(to), JSON.stringify(data));

    let rendered = await getTemplate(template).renderAsync(
        _.defaults(data || {}, {urls: config.get('urls')})
    );

    let mailerOptions = _.defaults({
        from: config.get('email:addresses:from'),
        to: to,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
    }, config.get('email:defaults'));

    await transport.sendMailAsync(mailerOptions);
    logger.debug('mailer.send -> done');
}

/**
 * Helper function that returns cached email template instance by template name.
 * @param templateName the template name.
 * @return cached the template instance
 */
function getTemplate(templateName) {
    logger.debug('mailer.getTemplate', templateName);

    if (!_.has(templatesCache, templateName)) {
        templatesCache[templateName] = promise.promisifyAll(new EmailTemplate(path.join(templatesDir, templateName)));
        logger.debug('mailer.getTemplate -> added to cache', templateName);
    }

    logger.debug('mailer.getTemplate -> done');
    return templatesCache[templateName];
}

module.exports = {
    send: send

};