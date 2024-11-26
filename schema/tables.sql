# These are the sites that we support - we have this table already
CREATE TABLE sites (
    internal_id INT AUTO_INCREMENT PRIMARY KEY,
    host VARCHAR(255) NOT NULL UNIQUE,
    webhook_secret VARCHAR(255) NOT NULL
);

# These are activitypub accounts, both local and remote
CREATE TABLE accounts (
    internal_id INT AUTO_INCREMENT PRIMARY KEY,
    # id VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255)
);

# These are our users - they're tied to an activitypub account 
CREATE TABLE users (
    internal_id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    site_id INT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(internal_id) ON DELETE CASCADE,
    FOREIGN KEY (site_id) REFERENCES sites(internal_id) ON DELETE CASCADE
);

# Posts are things that appear in the feed
CREATE TABLE posts (
    internal_id INT AUTO_INCREMENT PRIMARY KEY,
    # id VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255),
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    type TINYINT NOT NULL, # an enum for article/note/etc...
    FOREIGN KEY (author_id) REFERENCES accounts(internal_id) ON DELETE CASCADE
);

# This is the "join" table which determines which posts are in a users feed
# Anything we want to order or filter the feed on needs to be duplicated here
CREATE TABLE feeds (
    internal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    author_id INT NOT NULL, # author_id here so we can delete where on it
    type TINYINT NOT NULL, # type here so we can filter on it
    FOREIGN KEY (user_id) REFERENCES users(internal_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(internal_id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES accounts(internal_id) ON DELETE CASCADE
);

CREATE TABLE likes (
    internal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(internal_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(internal_id) ON DELETE CASCADE,
    UNIQUE(user_id, post_id)
);

# This handles storing all follows in both directions for local and remote accounts
CREATE TABLE follows (
    internal_id INT AUTO_INCREMENT PRIMARY KEY,
    follower_id INT NOT NULL,
    following_id INT NOT NULL,
    FOREIGN KEY (follower_id) REFERENCES accounts(internal_id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES accounts(internal_id) ON DELETE CASCADE
);

# Fast lookup of site for each request
CREATE INDEX idx_sites_host ON sites (host);

# Lookup of account from standard AP id
# CREATE INDEX idx_accounts_id ON accounts (id);

# Lookup of account via username and host
CREATE INDEX idx_accounts_username ON accounts (username);
CREATE INDEX idx_users_account_id ON users (account_id);
CREATE INDEX idx_users_site_id ON users (site_id);

# Get all posts from an author
CREATE INDEX idx_posts_author_id ON posts (author_id);

# Get feed items for a user
CREATE INDEX idx_feeds_user_id ON feeds (user_id);

# Not sure if we need this?
CREATE INDEX idx_feeds_post_id ON feeds (post_id);

# Get users liked posts
CREATE INDEX idx_likes_user_id ON likes (user_id);

# Get internal liked count for post
CREATE INDEX idx_likes_post_id ON likes (post_id);

# Lookup followers in both directions
CREATE INDEX idx_follows_follower_id ON follows (follower_id);
CREATE INDEX idx_follows_following_id ON follows (following_id);

