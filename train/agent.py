import json

from tensorforce.agents import DQNAgent, Agent
from train_simulation_wrapper import SimulationWrapper

environment = SimulationWrapper()

# Network is an ordered list of layers
# network_spec = [dict(type='dense', size=256), dict(type='dense', size=128)]
with open('tensorforce_configs/mlp2_network.json', 'r') as fp:
    network_spec = json.load(fp=fp)

with open('tensorforce_configs/ppo.json', 'r') as fp:
    agent_config = json.load(fp=fp)

# initial_epsilon = 0.6
# final_epsilon = 0.0
# anneal_timesteps = 100000
agent = Agent.from_spec(
        spec=agent_config,
        kwargs=dict(
            states=environment.states,
            actions=environment.actions,
            network=network_spec,
        )
    )
# agent = DQNAgent(
#     states=environment.states,
#     actions=environment.actions,
#     network=network_spec,
#     memory=dict(
#         type='replay',
#         include_next_states=True,
#         capacity=50000
#     ),
#     optimizer=dict(
#         type='clipped_step',
#         clipping_value=0.01,
#         optimizer=dict(
#             type='adam',
#             learning_rate=1e-3
#         )
#     ),
#     actions_exploration=dict(
#         type='epsilon_anneal',
#         initial_epsilon=initial_epsilon,
#         final_epsilon=final_epsilon,
#         timesteps=anneal_timesteps
#     ),
#     discount = 0.98,
#     target_sync_frequency=100,
#     double_q_model=True
# )

max_episodes = 1000
max_timesteps = 2000

episode = 0
episode_rewards = list()

while True:
    state = environment.reset()
    agent.reset()

    timestep = 0
    episode_reward = 0.0
    while True:
        action_int = agent.act(states=state)
        print('\n\n')
        print('state', state)
        print('action', action_int)
        print('\n\n')
        state, reward, terminal = environment.execute(action_int)
        print('about to observe', reward, terminal)
        if terminal:
            reward = 0.0
        agent.atomic_observe(reward=reward, terminal=terminal)
        print('observed')

        timestep += 1
        episode_reward += reward

        print('before terminal or timestep check')
        if terminal or timestep == max_timesteps:
            print('entered terminal or timestep clause')
            print(terminal, timestep, max_timesteps)
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
    # total_timesteps = max_timesteps * episode
    # current_epsilon = initial_epsilon - total_timesteps*(initial_epsilon - final_epsilon)/anneal_timesteps
    # print('current epsilon: ', current_epsilon)
    print('\n\n')
    episode_rewards.append(episode_reward)
    #agent.save_model('saved_models/dqn_agent')
    if episode == max_episodes:
        break
