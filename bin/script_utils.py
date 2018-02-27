import json
import logging
import os

from argparse import ArgumentParser
from configparser import ConfigParser

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_DIR = os.path.join(BASE_DIR, 'config')
DATA_DIR = os.path.join(BASE_DIR, 'data')


def create_arg_parser(prog_name, desc, parents=[]):
    if not prog_name:
        raise ValueError('prog_name must not be empty')

    if not desc:
        raise ValueError('desc must not be empty')

    parser = ArgumentParser(description=desc, prog=prog_name,
                            add_help=False, parents=parents)
    parser.add_argument('-v', '--verbose', action='store_true',
                        help='increase default logger level to INFO',
                        required=False)
    parser.add_argument('-h', '--help', action='help',
                        help='show this help message and exit')

    args = vars(parser.parse_known_args()[0])

    if args['verbose']:
        init_logger(log_level=logging.INFO)
    else:
        init_logger(log_level=logging.ERROR)

    return parser


def get_config(section):
    if not section:
        raise ValueError('section must not be empty')

    config = ConfigParser()
    config.read(get_config_file_path('config.ini'))

    return dict(config[section].items())


def get_config_file_path(config_file):
    return os.path.join(CONFIG_DIR, config_file)


def get_data_file_path(data_file):
    return os.path.join(DATA_DIR, data_file)


def init_logger(log_level, log_format='%(levelname)s: %(message)s'):
    if not log_level:
        raise ValueError('level must be set.')

    logging.basicConfig(format=log_format, level=log_level)


def parse_json_data(data_source):
    data = None
    with open(data_source, 'r') as source:
        data = json.load(source)

    return data
