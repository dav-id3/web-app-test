"""create_subcategories

Revision ID: c043dccc3330
Revises: 9fdba2445104
Create Date: 2023-05-16 18:24:39.988722

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c043dccc3330'
down_revision = '9fdba2445104'
branch_labels = None
depends_on = None

TABLE_NAME = 'categories'


def upgrade() -> None:
    op.create_table(
        TABLE_NAME,
        sa.Column('id', sa.Integer, primary_key=True, index=True, autoincrement=True),
        sa.Column('category', sa.String(length=15), nullable=False),
    )
    pass


def downgrade() -> None:
    op.drop_table(TABLE_NAME)
    pass
