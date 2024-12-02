import random
import pandas as pd
import numpy as np
from tqdm import tqdm

# Scaling factor for development because it can be terribly painful to generate the full set of data
# 0.1 = 10% of max data
# 1.0 = 100% of max data
SCALING_FACTOR = 0.1

# Parameters
MAX_ACCOUNTS_TO_FOLLOW = int(2500000 * SCALING_FACTOR)
NUM_ACCOUNTS_TO_FOLLOWING = int(60000 * SCALING_FACTOR)
NUM_ACCOUNTS_TO_FOLLOW = MAX_ACCOUNTS_TO_FOLLOW - NUM_ACCOUNTS_TO_FOLLOWING
CHUNK_SIZE = 10000  # Number of rows to write per CSV chunk
OUTPUT_FILE_PREFIX = "output/followers_chunk"

def random_number_beta(min_val=1, max_val=MAX_ACCOUNTS_TO_FOLLOW, alpha=0.1, beta=4, average=1000):
    """
    Generate random numbers between min_val and max_val using a scaled beta distribution.
    """
    # Generate a beta-distributed random number
    raw_beta = np.random.beta(alpha, beta)

    # Scale and shift to match the desired range
    scaled = min_val + (max_val - min_val) * raw_beta

    # Ensure the average is approximately correct by adjusting alpha and beta
    return int(scaled)

def generate_follows(start_account, end_account):
    """Generate follows data for a range of account IDs."""
    follows = []
    for following_id in tqdm(range(start_account, end_account + 1), desc="Generating follows"):
        number_of_followers = random_number_beta();
        follower_ids = random.sample(range(NUM_ACCOUNTS_TO_FOLLOWING + 1, NUM_ACCOUNTS_TO_FOLLOW + 1), number_of_followers)
        follows.extend({"follower_id": follower_id, "following_id": following_id} for follower_id in follower_ids)
    return pd.DataFrame(follows)

if __name__ == "__main__":
    # Generate data in chunks
    for start_account in range(1, NUM_ACCOUNTS_TO_FOLLOWING + 1, CHUNK_SIZE):
        end_account = min(start_account + CHUNK_SIZE - 1, NUM_ACCOUNTS_TO_FOLLOWING)
        print(f"Processing accounts {start_account} to {end_account}...")

        # Generate follows for the current chunk
        follows_df = generate_follows(start_account, end_account)

        # Write to CSV
        output_file = f"{OUTPUT_FILE_PREFIX}_{start_account}_to_{end_account}.csv"
        follows_df.to_csv(output_file, index=False)
        print(f"Chunk saved to {output_file}")

