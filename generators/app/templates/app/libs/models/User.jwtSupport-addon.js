'use strict';

const promise = require('utils/promise'),
    <% if (locals.useMongo) {%>
    mongoose = require('utils/mongoose'),<%}%>
    <% if (locals.useSequelize) {%>
    sequelize = require('utils/sequelize'),
    Sequelize = require('sequelize'),<%}%>
    bcrypt = require('utils/bcrypt'),
    SALT_WORK_FACTOR = 10;

/**
 * User entity scheme.
 * @type {*|Schema}
 */

<% if (locals.useMongo) {%>
    let userSchema = new mongoose.Schema({
        login: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    });

    /**
     * Save-hook that fills password field with bcrypt hash.
     */
    userSchema.pre('save', promise.asyncHook(async function (user) {

        if (!user.isModified('password')) {
            return;
        }

        user.password = await bcrypt.hashAsync(user.password, await bcrypt.genSaltAsync(SALT_WORK_FACTOR));
    }));


    /**
     * Verifies that password is equal to password of this user.
     * @param candidatePassword password to verify.
     * @return promised true if equals, false otherwise.
     */
    userSchema.methods.comparePasswordAsync = async function (candidatePassword) {
        return await bcrypt.compareAsync(candidatePassword || '', this.password);
    };

    module.exports = mongoose.model('User', userSchema);
<%}%>
<% if (locals.useSequelize) {%>
    let userModel = sequelize.define('User', {
        login: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        instanceMethods: {
            comparePasswordAsync: async function (candidatePassword) {
                return await bcrypt.compareAsync(candidatePassword || '', this.password);
            }
        }
    });

    /**
     * Save-hook that fills password field with bcrypt hash.
     */
    userModel.addHook('beforeCreate', async function (user) {
        if (!user.changed('password')) {
            return;
        }

        user.password = await bcrypt.hashAsync(user.password, await bcrypt.genSaltAsync(SALT_WORK_FACTOR));
    });

    module.exports = userModel;
<%}%>



