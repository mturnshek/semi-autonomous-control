import json

import tensorflow as tf

from tensorforce.agents import Agent
from train_simulation_wrapper import SimulationWrapper


environment = SimulationWrapper()

with open('tensorforce_configs/mlp2_64_network.json', 'r') as fp:
    network_spec = json.load(fp=fp)

with open('tensorforce_configs/ppo.json', 'r') as fp:
    agent_config = json.load(fp=fp)

agent = Agent.from_spec(
        spec=agent_config,
        kwargs=dict(
            states=environment.states,
            actions=environment.actions,
            network=network_spec,
        )
    )

# print(agent.model.actions_output['action'].name)
# exit()
# print(dir(agent.model))
# print(agent.model)
# print(dir(agent.model.graph))
# print(agent.model.summarizer)
# print(agent.model.summaries)
# print(agent.model.get_summaries())
# print(agent.model.get_savable_components())
# print(agent.saver)
# print(dir(agent.saver))
# tf.train.write_graph(agent.model.graph, 'saved_models', 'ppo_agent.pb')
# exit()

max_episodes = 1000
max_timesteps = 2000
episode_save_period = 10

episode = 0
episode_rewards = list()

while True:
    state = environment.reset()
    agent.reset()

    timestep = 0
    episode_reward = 0.0
    while True:
        action_int = agent.act(states=state)
        state, reward, terminal = environment.execute(action_int)
        agent.observe(reward=reward, terminal=terminal)

        timestep += 1
        episode_reward += reward

        if terminal or timestep == max_timesteps:
            break

    episode += 1
    print('EPISODE', episode)
    print('reward:', episode_reward)
    print('num ship collisions: ', environment.episode_n_ship_collision)
    print('num action passthroughs: ', environment.episode_n_action_passthrough)
    print('num action overrides: ', environment.episode_n_action_override)
    print('num nones: ', environment.episode_n_action_none)
    print('num lefts: ', environment.episode_n_action_left)
    print('num ups: ', environment.episode_n_action_up)
    print('num rights: ', environment.episode_n_action_right)
    print('num downs: ', environment.episode_n_action_down)
    print('\n\n')
    episode_rewards.append(episode_reward)

    if episode % episode_save_period == 0:
        agent.model.save('saved_models/ppo_agent')
    if episode == max_episodes:
        break
