import json

import tensorflow as tf

from tensorforce.agents import Agent
from train_simulation_wrapper import SimulationWrapper


class SemiAutonomousAgent:
    def __init__(self, training=False):
        self.environment = SimulationWrapper()
        self.default_path = 'saved_models/ppo_agent'

    def run(self):
        """
            The agent acts on its environment without learning.
        """
        while True:
            state = self.environment.reset()
            self.tensorforce_agent.reset()
            while True:
                action_int = tensorforce_agent.act(states=state)
                state, _, _, = environment.execute(action_int)

    def train(self, save=True):
        """
            The agent acts on and learns from its environment.
        """
        max_episodes = 1000
        max_timesteps = 2000
        episode_save_period = 10
        episode = 0
        episode_rewards = []

        while True:
            state = self.environment.reset()
            self.tensorforce_agent.reset()

            timestep = 0
            episode_reward = 0.0
            while True:
                action_int = tensorforce_agent.act(states=state)
                state, reward, terminal = environment.execute(action_int)
                tensorforce_agent.observe(reward=reward, terminal=terminal)

                timestep += 1
                episode_reward += reward

                if terminal or timestep == max_timesteps:
                    break

            episode += 1
            episode_rewards.append(episode_reward)
            self.print_status()

            if save and (episode % episode_save_period == 0):
                self.save()
            if episode == max_episodes:
                break

    def print_status(self):
        print('EPISODE', episode)
        print('reward:', episode_reward)
        print('num ship collisions: ', this.environment.episode_n_ship_collision)
        print('num action passthroughs: ', this.environment.episode_n_action_passthrough)
        print('num action overrides: ', this.environment.episode_n_action_override)
        print('num nones: ', this.environment.episode_n_action_none)
        print('num lefts: ', this.environment.episode_n_action_left)
        print('num ups: ', this.environment.episode_n_action_up)
        print('num rights: ', this.environment.episode_n_action_right)
        print('num downs: ', this.environment.episode_n_action_down)
        print('\n\n')


    def create_tensorforce_agent(self):
        with open('tensorforce_configs/mlp2_64_network.json', 'r') as fp:
            network_spec = json.load(fp=fp)

        with open('tensorforce_configs/ppo.json', 'r') as fp:
            agent_config = json.load(fp=fp)

        self.tensorforce_agent = Agent.from_spec(
                spec=agent_config,
                kwargs=dict(
                    states=this.environment.states,
                    actions=this.environment.actions,
                    network=network_spec,
                )
            )

    def load(self, path=None):
        if path == None:
            path = self.default_path
        # more ...

    def save(self, path=None):
        if path == None:
            path = self.default_path
        self.tensorforce_agent.model.save(self.default_path)
