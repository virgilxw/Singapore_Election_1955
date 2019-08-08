import pandas as pd

data = pd.read_csv("./election results/parliamentary-general-election-results-by-candidate.csv")

df = data.loc[data["year"]==1955].drop(["year", "constituency_type", "vote_count"], axis=1)

print (df)

def get_winners(group):
    return group.loc[group['vote_percentage'] == group['vote_percentage'].max()]

winners = df.groupby('constituency').apply(get_winners).reset_index(drop=True).sort_values(by="vote_percentage", ascending=False).set_index(keys="constituency")

winners.to_json("output.json", orient="index")