'use strict';

const promise = require('utils/promise'),
    <%_ if (locals.useMongo) {_%>
    mongoose = require('utils/mongoose'),
    <%_}_%>
    <%_ if (locals.useSequelize) {_%>
    sequelize = require('utils/sequelize'),
    Sequelize = require('sequelize'),
    <%_}_%>
    bcrypt = require('utils/bcrypt'),
    SALT_WORK_FACTOR = 10;

/**
 * User entity scheme.
 * @type {*|Schema}
 */

<%_ if (locals.useMongo) {_%>
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
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'BLOCKED'],
        default: 'ACTIVE',
        required: true
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    },
    verifyLinkExpiration: {
        type: String
    },
    verifyToken: {
        type: String
    }
});

/**
 * Save-hook that fills password field with bcrypt hash.
 */
userSchema.pre('save', promise.asyncHook(async user => {

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
<%_}_%>
<%_ if (locals.useSequelize) {_%>
let userModel = sequelize.define('User', {
    login: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        required: true
    },
    verifyLinkExpiration: {
        type: Sequelize.STRING
    },
    verifyToken: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.ENUM,
        values: ['ACTIVE', 'BLOCKED'],
        defaultValue: 'ACTIVE',
        allowNull: false
    },
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
userModel.addHook('beforeCreate', async user => {
    if (!user.changed('password')) {
        return;
    }

    user.password = await bcrypt.hashAsync(user.password, await bcrypt.genSaltAsync(SALT_WORK_FACTOR));
});

module.exports = userModel;
<%_}_%>



