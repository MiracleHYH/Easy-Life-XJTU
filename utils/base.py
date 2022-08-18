import yaml


class Base:
    def __init__(self) -> None:
        with open('./conf.yaml', 'r', encoding='utf-8') as f:
            self.data = yaml.load(f, Loader=yaml.FullLoader)