import numpy as np

from connection import Connection


class SemiAutonomousControlEnvironment:
    def __init__(self, train=False):
        self.action_none = np.array([1., 0., 0., 0., 0.])
        self.action_left = np.array([0., 1., 0., 0., 0.])
        self.action_up = np.array([0., 0., 1., 0., 0.])
        self.action_right = np.array([0., 0., 0., 1., 0.])
        self.action_down = np.array([0., 0., 0., 0., 1.])

        self.connection = Connection()

        """
        STATE MAKEUP
            past three frames of:
        [96 feelers, ship collision, dx, dy] = 96 + 3
            then, the human action concatted at the end, which looks like:
        [0 1 0 0 0], for example. + 5

        3*(96 + 3) + 5 = 302
        """
        state_frames = 3
        num_feelers = 96
        self.asteroid_collision_index = state_frames*(num_feelers + 3) - 3
        self.start_action_index = state_frames*(num_feelers + 3)
        self.state_size = state_frames*(num_feelers + 3) + 5

        # Tensorforce environment specs
        self.states = dict(shape=(self.state_size,), type='float')
        self.actions = dict(type='int', num_actions=5)

        self.total_episode_steps = 1000
        self.current_episode_step = 0
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
        return self.connection.get_state()

    def reset(self):
        self.reset_debug_vars()
        self.connection.send_action(self.action_none)
        return self.get_state()

    def is_ship_colliding(self, state):
        # if this value in the state is 1.0, that means the ship is colliding
        # with an asteroid.
        return (state[self.asteroid_collision_index] == 1.0)

    def is_human_action_passed_through(self, state, action):
        human_action = state[self.start_action_index:self.state_size]
        return np.array_equal(action, human_action)

    def parse_reward_and_log(self, state, action):
        ship_collision_reward = -8.0
        human_action_passthrough_reward = 1.0
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

        return reward

    def is_terminal(self):
        if self.current_episode_step == self.total_episode_steps:
            self.current_episode_step = 0
            return True
        else:
            return False

    def int_to_action_one_hot_and_log(self, action_int):
        if action_int == 0:
            self.episode_n_action_none += 1
            return self.action_none
        elif action_int == 1:
            self.episode_n_action_left += 1
            return self.action_left
        elif action_int == 2:
            self.episode_n_action_up += 1
            return self.action_up
        elif action_int == 3:
            self.episode_n_action_right += 1
            return self.action_right
        elif action_int == 4:
            self.episode_n_action_down += 1
            return self.action_down

    def execute(self, action_int):
        action = self.int_to_action_one_hot_and_log(action_int)
        self.connection.send_action(action)
        state = self.get_state()
        reward = self.parse_reward_and_log(state, action)
        terminal = self.is_terminal()
        self.current_episode_step += 1
        return (state, reward, terminal)
