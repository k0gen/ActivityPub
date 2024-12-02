import random
import pandas as pd
from faker import Faker
from tqdm import tqdm

# Scaling factor for development because it can be terribly painful to generate the full set of data
# 0.1 = 10% of max data
# 1.0 = 100% of max data
SCALING_FACTOR = 0.1

# Parameters
NUM_SITES = int(60000 * SCALING_FACTOR)
NUM_USERS = int(300000 * SCALING_FACTOR)
NUM_ACCOUNTS = int(2500000 * SCALING_FACTOR)  # Includes off-service accounts
NUM_POSTS = int(3000000 * SCALING_FACTOR)
CHUNK_SIZE = 100000  # Number of rows to write per chunk

# Function to save DataFrame in chunks with progress bar
def save_in_chunks(df, file_path, chunk_size=CHUNK_SIZE):
    total_rows = len(df)
    with open(f"output/{file_path}", "w") as f:
        for i in tqdm(range(0, total_rows, chunk_size), desc=f"Writing {file_path}"):
            df.iloc[i:i + chunk_size].to_csv(f, index=False, header=i == 0, mode='a')


print(f"Generating {NUM_SITES} sites, {NUM_USERS} users, {NUM_ACCOUNTS} accounts, and {NUM_POSTS} posts")

# Generate sites
print("\n\nGenerating sites...")
webhook_secret = "fake-webhook-secret"
sites = pd.DataFrame({
    "internal_id": range(1, NUM_SITES + 1),
    "host": [f"site-{i}.com" for i in tqdm(range(NUM_SITES), desc="Generating Sites")],
    "webhook_secret": [webhook_secret for _ in range(NUM_SITES)]
})
save_in_chunks(sites, "sites.csv")

# Generate accounts
print("\n\nGenerating accounts...")
accounts = pd.DataFrame({
    "internal_id": range(1, NUM_ACCOUNTS + 1),
    "name": [f"Name {i}" for i in tqdm(range(NUM_ACCOUNTS), desc="Generating Names")],
    "username": [f"user-{i}" for i in tqdm(range(NUM_ACCOUNTS), desc="Generating Usernames")],
    "description": ["The quick brown fox jumps over the lazy dog" for _ in range(NUM_ACCOUNTS)],
    "icon": [f"https://icons.com/{i}.jpg" for i in range(NUM_ACCOUNTS)]
})
save_in_chunks(accounts, "accounts.csv")

# Generate users
print("\n\nGenerating users...")
users = pd.DataFrame({
    "internal_id": range(1, NUM_USERS + 1),
    "account_id": range(1, NUM_USERS + 1),
    "site_id": [random.randint(1, NUM_SITES) for _ in tqdm(range(NUM_USERS), desc="Assigning Sites to Users")]
})
save_in_chunks(users, "users.csv")

# Generate posts
print("\n\nGenerating posts...")
posts = pd.DataFrame({
    "internal_id": range(1, NUM_POSTS + 1),
    "title": [f"Post {i}" for i in tqdm(range(NUM_POSTS), desc="Generating Titles")],
    "content": [f"This is the content for post {i}. The quick brown fox jumps over the lazy dog" for i in tqdm(range(NUM_POSTS), desc="Generating Content")],
    "author_id": [random.randint(1, NUM_ACCOUNTS) for _ in range(NUM_POSTS)],
    "type": [random.randint(1, 5) for _ in range(NUM_POSTS)]  # Example: 5 post types
})
save_in_chunks(posts, "posts.csv")

print("\n✅ Data generation complete!")
