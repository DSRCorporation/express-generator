'use strict';

var Generator = require('yeoman-generator'),
    crypto = require('crypto');

module.exports = class extends Generator {
    prompting() {
        return this.prompt([{
            type     : 'input',
            name     : 'appName',
            message  : 'Your project name',
            validate : function (input) {
                        var validateExp = new RegExp('^[0-9a-z]+$', 'i');
                        return validateExp.test(input) ? true : 'The app name must consist only of latin letters and digits.';
                    }
        },
        {
            type     : 'input',
            name     : 'dbName',
            message  : 'Your database name',
            validate : function (input) {
                var validateExp = new RegExp('^[0-9a-z]+$', 'i');
                return validateExp.test(input) ? true : 'The database name must consist only of latin letters and digits.';
            }
        }]).then((answers) => {
            this.config.set(answers);
            this.config.save();
        });
    }

    writing() {
        var config = this.config.getAll();

        this.config.set('jwtSecret', this._generateJwtSecret());
        this._addBaseProject();
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
                this.templatePath('**')
            ],
            this.destinationRoot(),
            config

        );
        this.log('Added base project');
    }
};