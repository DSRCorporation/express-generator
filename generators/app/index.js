'use strict';

var Generator = require('yeoman-generator'),
    crypto = require('crypto'),
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
                }
            },
            {   when : function(prompts){
                    return prompts.database === 'usePostgres' || prompts.database === 'useMysql';
                },
                type     : 'input',
                name     : 'dbUsername',
                message  : 'Enter database username'
            },
            {   when : function(prompts){
                    return prompts.database === 'usePostgres' || prompts.database === 'useMysql';
                },
                type     : 'input',
                name     : 'dbPassword',
                message  : 'Enter database password'
            },
            {
                type     : 'confirm',
                name     : 'jwtSupport',
                message  : 'Would you like a JWT authorization?',
                default: true
            },
            {
                type: 'checkbox',
                name: 'promissifiedUtils',
                message: 'Promissified utils:',
                choices: [{
                    name: 'Common. Some usefull lodash extensions',
                    value: 'includeCommon',
                    checked: false
                }, {
                    name: 'Promissified fs-extra',
                    value: 'includeFsExtra',
                    checked: false
                }]
            },
        ]).then((answers) => {
            answers[answers.database] = true;
            if (answers.database === 'useMysql' || answers.database === 'usePostgres') {
                answers.useSequelize = true;
            }
            delete answers['database'];
            let config = _.cloneDeep(answers);

            _(answers).forIn((answer, key) => {
               if (typeof answer === 'object') {
                   _(answer).forEach(prop => {
                       config[prop] = true;
                   });
                   delete config[key];
               }
            });
            this._copyingFiles(config);
        });
    }

    _copyingFiles(config) {
        config.jwtSecret = this._generateJwtSecret();
        this._addBaseProject(config);
        this._copyingAddOns(config);
    }

    install() {
        this.log('Installing dependencies');
        this.npmInstall();
    }

    end() {
        this.log('Your app is ready!');
    }

    _generateJwtSecret() {
        this.log('Generated jwtSecret.');
        return crypto.randomBytes(256).toString('hex');
    }

    _addBaseProject(config) {
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