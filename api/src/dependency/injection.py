"""dependency injencton"""
import src.service.base as base
from src.configuration.env import new_env
from src.model import BaseMySQL
from src.repository import mysql

env = new_env()

mysqlrep: mysql.Interface = mysql.Repository(env)

BaseMySQL.prepare(mysqlrep.engine)

basesvc: base.Interface = base.Service()
