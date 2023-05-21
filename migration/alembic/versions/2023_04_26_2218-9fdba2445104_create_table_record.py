"""create_table_record

Revision ID: 9fdba2445104
Revises: 9ec7bca53aa3
Create Date: 2023-04-26 22:18:52.821284

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9fdba2445104'
down_revision = '9ec7bca53aa3'
branch_labels = None
depends_on = None

TABLE_NAME = 'records'


def upgrade() -> None:
    op.create_table(
        TABLE_NAME,
        sa.Column('id', sa.Integer, primary_key=True, index=True, autoincrement=True),
        sa.Column('name', sa.String(length=15), nullable=False),
        sa.Column('category_id', sa.Integer, nullable=False),
        sa.Column('subcategory_id', sa.Integer, nullable=True),
        sa.Column('amount', sa.Integer, nullable=False),
        sa.Column('description', sa.String(length=15), nullable=True),
        sa.Column('is_spending', sa.Boolean, nullable=False),
        sa.Column('date', sa.String(length=15), nullable=False),
    )
    pass


def downgrade() -> None:
    op.drop_table(TABLE_NAME)
    pass
