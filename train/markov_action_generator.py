import numpy as np


class MarkovActionGenerator:
    def __init__(self):
        self.chance_of_random_action = .3
        self.none = np.array([1., 0., 0., 0., 0.])
        self.left = np.array([0., 1., 0., 0., 0.])
        self.up = np.array([0., 0., 1., 0., 0.])
        self.right = np.array([0., 0., 0., 1., 0.])
        self.down = np.array([0., 0., 0., 0., 1.])
        self.action = self.random_action()

    def random_action(self):
        r = np.random.random()
        if r < .2:
            return self.none
        elif r < .4:
            return self.left
        elif r < .6:
            return self.up
        elif r < .8:
            return self.right
        else:
            return self.down

    def next_action(self):
        if np.random.random() < self.chance_of_random_action:
            self.action = self.random_action()
        return self.action
