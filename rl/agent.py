import json

import tensorflow as tf

from tensorforce.agents import Agent
from environment import SemiAutonomousControlEnvironment


class SemiAutonomousAgent:
    def __init__(self, new_model=True, model_path='saved_models/ppo_agent'):
        self.environment = SemiAutonomousControlEnvironment()
        self.model_path = model_path
        self.tensorforce_agent = self.generate_tensorforce_agent()
        if not new_model:
            self.load_model() # loads from self.model_path unless specified

    def run(self):
        """
            The agent continually acts on its environment without learning.
        """
        print('Reading to start environment for demoing.')
        while True:
            state = self.environment.reset()
            self.tensorforce_agent.reset()
            while True:
                action_int = self.tensorforce_agent.act(states=state)
                state, _, _, = self.environment.execute(action_int)

    def train(self, save=True):
        """
            The agent continually acts on and learns from its environment.
        """
        self.max_episodes = 1000
        self.max_timesteps = 2000
        self.episode_save_period = 10
        self.episode = 0
        self.episode_rewards = []

        print('Ready to start environment for training.')
        while True:
            state = self.environment.reset()
            self.tensorforce_agent.reset()

            timestep = 0
            self.episode_reward = 0.0
            while True:
                action_int = self.tensorforce_agent.act(states=state)
                state, reward, terminal = self.environment.execute(action_int)
                self.tensorforce_agent.observe(reward=reward, terminal=terminal)

                timestep += 1
                self.episode_reward += reward

                if terminal or timestep == self.max_timesteps:
                    break

            self.episode += 1
            self.episode_rewards.append(self.episode_reward)
            self.print_status()

            if save and (self.episode % self.episode_save_period == 0):
                self.save_model()
            if self.episode == self.max_episodes:
                break

    def print_status(self):
        print('EPISODE', self.episode)
        print('reward:', self.episode_reward)
        print('num ship collisions: ', self.environment.episode_n_ship_collision)
        print('num action passthroughs: ', self.environment.episode_n_action_passthrough)
        print('num action overrides: ', self.environment.episode_n_action_override)
        print('num nones: ', self.environment.episode_n_action_none)
        print('num lefts: ', self.environment.episode_n_action_left)
        print('num ups: ', self.environment.episode_n_action_up)
        print('num rights: ', self.environment.episode_n_action_right)
        print('num downs: ', self.environment.episode_n_action_down)
        print('\n\n')

    def generate_tensorforce_agent(self):
        with open('tensorforce_configs/mlp2_64_network.json', 'r') as fp:
            network_spec = json.load(fp=fp)
        with open('tensorforce_configs/ppo.json', 'r') as fp:
            agent_config = json.load(fp=fp)
        tensorforce_agent = Agent.from_spec(
                spec=agent_config,
                kwargs=dict(
                    states=self.environment.states,
                    actions=self.environment.actions,
                    network=network_spec,
                )
            )
        return tensorforce_agent

    def save_model(self, path=None):
        if path == None:
            path = self.model_path
        print(path)
        self.tensorforce_agent.save_model(path)

    def load_model(self, path=None):
        if path == None:
            path = self.model_path
        print(path)
        self.tensorforce_agent.restore_model(directory='saved_models')
