'use strict';

var Generator = require('yeoman-generator'),
    crypto = require('crypto'),
    rename = require('gulp-rename');

module.exports = class extends Generator {
    prompting() {
        this.config.delete();
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
                name     : 'dbName',
                message  : 'Enter database name',
                validate : function (input) {
                    var validateExp = new RegExp('^[0-9a-z]+$', 'i');
                    return validateExp.test(input) ? true : 'The database name must consist only of latin letters and digits.';
                }
            },
            {
                type     : 'input',
                name     : 'version',
                message  : 'Enter a version'
            },
            {
                type: 'confirm',
                name: 'useMongo',
                message: 'Would you like to use mongo database?',
                default: false
            },
            {
                when: function (prompts) {
                    prompts.modelExample = false;
                    return prompts.useMongo;
                },
                type: 'confirm',
                name: 'modelExample',
                message: 'Would you like to have a model example?',
                default: false
            }
        ]).then((answers) => {
            this.config.set(answers);
        });
    }

    writing() {
        var config = this.config.getAll();

        this.config.set('jwtSecret', this._generateJwtSecret());
        this._addBaseProject();
        this._copyingAddOns();
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

    _addBaseProject() {
        var config = this.config.getAll();

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

    _copyingAddOns() {
        this.log('Copying add-ons');

        var config = this.config.getAll(),
            addons = Object.keys(config),
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
            this.fs.copy(copySrc, this.destinationRoot());
        }
    }
};