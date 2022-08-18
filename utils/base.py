import yaml


class Base:
    def __init__(self) -> None:
        with open('../conf/user.yaml', 'r', encoding='utf-8') as f:
            self.user = yaml.load(f, Loader=yaml.FullLoader)