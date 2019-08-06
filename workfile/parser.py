import pandas as pd

data = pd.read_csv("./election results/parliamentary-general-election-results-by-candidate.csv")

racesFrom1955 = data.loc[data["year"]==1955].drop(["year", "constituency_type"], axis=1)

partyVoteCount = racesFrom1955.groupby("party", as_index=False).agg({"vote_count": "sum"})

print (partyVoteCount)