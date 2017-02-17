'use strict';

var Generator = require('yeoman-generator'),
    crypto = require('crypto'),
    removeEmptyLines = require('gulp-remove-empty-lines'),
    rename = require('gulp-rename'),
    _ = require('lodash');

module.exports = class extends Generator {
    prompting() {
        return this.prompt([
            {
                type     : 'input',
                name     : 'appName',
                message  : 'Enter project name',
                validate : function (input) {
                            var validateExp = new RegExp('^[0-9a-z]+-?[0-9a-z]+$', 'i');
                            return validateExp.test(input) ? true : 'The app name must consist only of latin letters, digits and single dash.';
                        }
            },
            {
                type     : 'input',
                name     : 'version',
                message  : 'Enter a version'
            },
            {
                type: 'list',
                name: 'database',
                message: 'What database you want to use?',
                choices: [
                    {name: "MongoDB (Mongoose)", value: "useMongo"},
                    {name: "MySql (Sequilize)", value: "useMysql"},
                    {name: "Postgres (Sequilize)", value: "usePostgres"}
                ]
            },
            {
                type     : 'input',
                name     : 'dbName',
                message  : 'Enter database name',
                validate : function (input) {
                    var validateExp = new RegExp('^[0-9a-z]+$', 'i');
                    return validateExp.test(input) ? true : 'The database name must consist only of latin letters and digits.';
                },
                default  : function(prompts) {
                    return prompts.appName;
                }
            },
            {
                type     : 'confirm',
                name     : 'jwtSupport',
                message  : 'Would you like a JWT authorization?',
                default  : true
            },
            {
                type     : 'confirm',
                name     : 'includeBabel',
                message  : 'Would you like to use Babel with Node LTS?',
                default  : false
            },
            {
                type: 'checkbox',
                name: 'promissifiedUtils',
                message: 'Promissified utils:',
                choices: [
                    {
                        name: 'Promissified fs-extra',
                        value: 'includeFsExtra',
                        checked: false
                    }
                ]
            },
        ]).then((answers) => {
            answers[answers.database] = true;
            if (answers.database === 'useMysql' || answers.database === 'usePostgres') {
                answers.useSequelize = true;
            }
            delete answers['database'];

            answers = _.transform(answers, function (result, value, key) {
                if (typeof answers[key] === 'object') {
                    _(answers[key]).forEach(prop => {
                        result[prop] = true;
                    });
                }
                else {
                    result[key] = value;
                }
            });

            this._copyingFiles(answers);
        });
    }

    _copyingFiles(config) {
        config.jwtSecret = this._generateJwtSecret();
        this.registerTransformStream(removeEmptyLines());
        this._addBaseProject(config);
        this._copyingAddOns(config);
    }

    end() {
        this.log('Your app is ready!');
    }

    _generateJwtSecret() {
        this.log('Generated jwtSecret.');
        return crypto.randomBytes(256).toString('hex');
    }

    _addBaseProject(config) {
        this.registerTransformStream(rename(function (path) {
            path.basename = path.basename.replace('appName', config.appName);
            return path;
        }));
        this.fs.copyTpl(
            [
                this.templatePath(),
                '!' + this.templatePath('**/*-addon*')
            ],
            this.destinationRoot(),
            config
        );
        this.log('Added base project');
    }

    _copyingAddOns(config) {
        this.log('Copying add-ons');

        var addons = Object.keys(config),
            copySrc = [];

        addons = addons.filter(function (addon) {
            return config[addon] === true;
        });
        addons.forEach(function (addon) {
            this.registerTransformStream(rename(function (path) {
                path.dirname = path.dirname.replace('.' + addon + '-addon', '');
                path.basename = path.basename.replace('.' + addon + '-addon', '');
                return path;
            }));
            copySrc.push(
                this.templatePath('*.' + addon + '-addon*'),
                this.templatePath('**/*.' + addon + '-addon*'),
                this.templatePath('*.' + addon + '-addon/**'),
                this.templatePath('**/*.' + addon + '-addon/**')
            );
        }.bind(this));
        if (copySrc.length) {
            this.fs.copyTpl(copySrc, this.destinationRoot(), config);
        }
    }
};