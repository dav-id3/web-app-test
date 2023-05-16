"""dependency injencton"""
import src.service.base as base
import src.service.account as account
import src.service.category as category
from src.configuration.env import new_env
from src.model import BaseMySQL
from src.repository import mysql

env = new_env()

mysqlrep: mysql.Interface = mysql.Repository(env)

BaseMySQL.prepare(mysqlrep.engine)

basesvc: base.Interface = base.Service()
accountsvc: account.Interface = account.Service()
categorysvc: category.Interface = category.Service()
