1. Nconf based multi-environment configuration (production, development) with defaults and overrides for some common cases.
* Async/await (Node 7 or Babel)
* Promises (native or bluebird)
 * Midleware helpers
 * Mongoose event handler helpers
* Common errors classes
* Serial initialization. Simple async/await based solution.
* Mongoose configuration
  * Skip promisification. Use mongoose promise API
  * Provide promise implementation to mongoose config
  * Sequence support
* Model example
  * User (will be used for auth/security)
* Dictionaries loader
  * Splitting of important data and sample
* Middlweares
  * CORS. Use 3d party if there is good solution.
  * JWT support
  * Error handler
  * Static files
* Routes framework
* Routes example
  * Login
  * User CRUD
* Mailer
  * SMTP/SES configurations for dev/production
  * Template based emails
  * Common emails
  * Email example
* Promissified utils
  * Common. Some usefull lodash extensions
  * Bcrypt
  * Config (See #1)
  * Promissified fs-extra
  * JWT
  * Logger
  * Mailer (See #9)
  * module-packer
  * mongoose (See #6)
  * object-validatior
  * promise (See #3)
  * route-builder (See #7)
  * sequence-helper (See #6)
  * Storage helpers (Local/AWS S3)
* docker/docker-compose development config
* Test examples
* Promisified redis