import random
import pandas as pd
import numpy as np
from tqdm import tqdm

# Scaling factor for development because it can be terribly painful to generate the full set of data
# 0.1 = 10% of max data
# 1.0 = 100% of max data
SCALING_FACTOR = 0.1

# Parameters
NUM_ACCOUNTS_TO_FOLLOWING = int(60000 * SCALING_FACTOR)
NUM_ACCOUNTS_TO_FOLLOW = int(2500000 * SCALING_FACTOR) - NUM_ACCOUNTS_TO_FOLLOWING
NUM_FOLLOWS_PER_ACCOUNT = int(1000 * SCALING_FACTOR)
CHUNK_SIZE = 10000  # Number of rows to write per CSV chunk
OUTPUT_FILE_PREFIX = "output/followings_chunk"

def generate_followings(start_account, end_account):
    """Generate follows data for a range of account IDs."""
    follows = []
    for follower_id in tqdm(range(start_account, end_account + 1), desc="Generating follows"):
        following_ids = random.sample(range(NUM_ACCOUNTS_TO_FOLLOWING + 1, NUM_ACCOUNTS_TO_FOLLOW + 1), NUM_FOLLOWS_PER_ACCOUNT)
        follows.extend({"follower_id": follower_id, "following_id": following_id} for following_id in following_ids)
    return pd.DataFrame(follows)

if __name__ == "__main__":
    # Generate data in chunks
    for start_account in range(1, NUM_ACCOUNTS_TO_FOLLOWING + 1, CHUNK_SIZE):
        end_account = min(start_account + CHUNK_SIZE - 1, NUM_ACCOUNTS_TO_FOLLOWING)
        print(f"Processing accounts {start_account} to {end_account}...")

        # Generate follows for the current chunk
        follows_df = generate_followings(start_account, end_account)

        # Write to CSV
        output_file = f"{OUTPUT_FILE_PREFIX}_{start_account}_to_{end_account}.csv"
        follows_df.to_csv(output_file, index=False)
        print(f"Chunk saved to {output_file}")
