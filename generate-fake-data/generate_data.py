import random
import pandas as pd
from faker import Faker
from tqdm import tqdm

# Parameters
NUM_SITES = 60000
NUM_USERS = 300000
NUM_ACCOUNTS = 2500000  # Includes off-service accounts
NUM_POSTS = 3000000
FOLLOWERS_PER_SITE = 2000000  # Maximum potential followers for some sites
CHUNK_SIZE = 100000  # Number of rows to write per chunk

# Function to save DataFrame in chunks with progress bar
def save_in_chunks(df, file_path, chunk_size=CHUNK_SIZE):
    total_rows = len(df)
    with open(f"output/{file_path}", "w") as f:
        for i in tqdm(range(0, total_rows, chunk_size), desc=f"Writing {file_path}"):
            df.iloc[i:i + chunk_size].to_csv(f, index=False, header=i == 0, mode='a')

# Generate sites
print("Generating sites...")
webhook_secret = "fake-webhook-secret" 
sites = pd.DataFrame({
    "internal_id": range(1, NUM_SITES + 1),
    "host": [f"site-{i}.com" for i in tqdm(range(NUM_SITES), desc="Generating Sites")],
    "webhook_secret": [webhook_secret for _ in range(NUM_SITES)]
})
save_in_chunks(sites, "sites.csv")

# Generate accounts
print("Generating accounts...")
accounts = pd.DataFrame({
    "internal_id": range(1, NUM_ACCOUNTS + 1),
    "name": [f"Name {i}" for i in tqdm(range(NUM_ACCOUNTS), desc="Generating Names")],
    "username": [f"user-{i}" for i in tqdm(range(NUM_ACCOUNTS), desc="Generating Usernames")],
    "description": ["The quick brown fox jumps over the lazy dog" for _ in range(NUM_ACCOUNTS)],
    "icon": [f"https://icons.com/{i}.jpg" for i in range(NUM_ACCOUNTS)]
})
save_in_chunks(accounts, "accounts.csv")

# Generate users
print("Generating users...")
users = pd.DataFrame({
    "internal_id": range(1, NUM_USERS + 1),
    "account_id": range(1, NUM_USERS + 1),
    "site_id": [random.randint(1, NUM_SITES) for _ in tqdm(range(NUM_USERS), desc="Assigning Sites to Users")]
})
save_in_chunks(users, "users.csv")

# Generate posts
print("Generating posts...")
posts = pd.DataFrame({
    "internal_id": range(1, NUM_POSTS + 1),
    "title": [f"Post {i}" for i in tqdm(range(NUM_POSTS), desc="Generating Titles")],
    "content": [f"This is the content for post {i}. The quick brown fox jumps over the lazy dog" for i in tqdm(range(NUM_POSTS), desc="Generating Content")],
    "author_id": [random.randint(1, NUM_ACCOUNTS) for _ in range(NUM_POSTS)],
    "type": [random.randint(1, 5) for _ in range(NUM_POSTS)]  # Example: 5 post types
})
save_in_chunks(posts, "posts.csv")

print("Data generation complete!")
