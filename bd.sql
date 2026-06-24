CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email             VARCHAR(255) UNIQUE NOT NULL,
  password_hash     VARCHAR(255) NOT NULL,
  name              VARCHAR(100) NOT NULL,
  role              VARCHAR(20) NOT NULL DEFAULT 'reader'
                    CHECK (role IN ('admin', 'editor', 'reader')),
  is_active         BOOLEAN NOT NULL DEFAULT true,
  email_verified_at TIMESTAMP,
  created_at        TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_sessions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token       VARCHAR(255) UNIQUE NOT NULL,
  ip_address  VARCHAR(45),
  user_agent  TEXT,
  expires_at  TIMESTAMP NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE contacts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  subject     VARCHAR(200),
  message     TEXT NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'read', 'replied')),
  handled_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE newsletter_subscribers (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email            VARCHAR(255) UNIQUE NOT NULL,
  status           VARCHAR(20) NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'active', 'unsubscribed')),
  confirm_token    VARCHAR(255),
  confirmed_at     TIMESTAMP,
  unsubscribed_at  TIMESTAMP,
  created_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE comments (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_slug  VARCHAR(255) NOT NULL,
  parent_id  UUID REFERENCES comments(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  status     VARCHAR(20) NOT NULL DEFAULT 'pending'
             CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan                VARCHAR(50) NOT NULL,
  status              VARCHAR(20) NOT NULL
                      CHECK (status IN ('active', 'cancelled', 'past_due')),
  provider_id         VARCHAR(255),
  current_period_end  TIMESTAMP,
  created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE page_views (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_slug  VARCHAR(255) NOT NULL,
  ip_hash    VARCHAR(64),
  referrer   VARCHAR(500),
  country    VARCHAR(2),
  viewed_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para las consultas más frecuentes
CREATE INDEX idx_sessions_user    ON user_sessions(user_id);
CREATE INDEX idx_sessions_token   ON user_sessions(token);
CREATE INDEX idx_comments_slug    ON comments(post_slug);
CREATE INDEX idx_comments_user    ON comments(user_id);
CREATE INDEX idx_pageviews_slug   ON page_views(post_slug);
CREATE INDEX idx_pageviews_date   ON page_views(viewed_at);