import numpy as np

from connection import Connection
from markov_action_generator import MarkovActionGenerator


class SimulationWrapper:
    def __init__(self):
        self.connection = Connection()
        self.action_gen = MarkovActionGenerator()

        """
        STATE MAKEUP
            past three frames of:
        [64 feelers, ship collision, dx, dy] = 64 + 3
            then, the human action concatted at the end, which looks like:
        [0 1 0 0 0], for example. + 5

        3*(64 + 3) + 5 = 206
        """

        # Tensorforce environment specs
        #self.states = dict(shape=(206,), type='float')
        self.states = dict(shape=(5), type='float')
        self.actions = dict(type='int', num_actions=5)

        self.reset_debug_vars()

    def reset_debug_vars(self):
        self.episode_n_ship_collision = 0
        self.episode_n_action_passthrough = 0
        self.episode_n_action_override = 0
        self.episode_n_action_none = 0
        self.episode_n_action_left = 0
        self.episode_n_action_up = 0
        self.episode_n_action_right = 0
        self.episode_n_action_down = 0

    def get_state(self):
        # state_buffer = self.connection.get_state_buffer()
        action = self.action_gen.next_action()
        return action
        # return np.concatenate((state_buffer, action))

    def reset(self):
        self.reset_debug_vars()
        self.connection.publish_action(self.action_gen.none)
        return self.get_state()

    def is_ship_colliding(self, state):
        # if this value in the state is 1.0, that means the ship is colliding
        # with an asteroid.
        return False
        # return (state[197] == 1.0)

    def is_human_action_passed_through(self, state, action):
        # human_action = state[201:206]
        # return np.array_equal(action, human_action)
        return np.array_equal(state, action)

    def parse_reward_and_log(self, state, action):
        ship_collision_reward = 0.0 # just trying this to see if it learns or what
        human_action_passthrough_reward = 0.0
        other_action_reward = 0.0

        # if there's a spaceship collision, reward is negative.
        # if the action selected by the model is the same as human, positive
        # if the action selected by the model is different than human, neutral

        ship_collision = self.is_ship_colliding(state)
        human_action_passthrough = self.is_human_action_passed_through(state, action)

        reward = 0.0
        if ship_collision:
            reward += ship_collision_reward
            self.episode_n_ship_collision += 1
        if human_action_passthrough:
            reward += human_action_passthrough_reward
            self.episode_n_action_passthrough += 1
        else:
            reward += other_action_reward
            self.episode_n_action_override += 1

        if np.array_equal(action, self.action_gen.left):
            return 1.0
        return reward

    def int_to_action_one_hot_and_log(self, action_int):
        if action_int == 0:
            self.episode_n_action_none += 1
            return self.action_gen.none
        elif action_int == 1:
            self.episode_n_action_left += 1
            return self.action_gen.left
        elif action_int == 2:
            self.episode_n_action_up += 1
            return self.action_gen.up
        elif action_int == 3:
            self.episode_n_action_right += 1
            return self.action_gen.right
        elif action_int == 4:
            self.episode_n_action_down += 1
            return self.action_gen.down

    def execute(self, action_int):
        action = self.int_to_action_one_hot_and_log(action_int)
        self.connection.publish_action(action)
        state = self.get_state()
        reward = self.parse_reward_and_log(state, action)
        terminal = False
        return (state, reward, terminal)
