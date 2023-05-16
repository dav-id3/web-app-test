"""create_categories

Revision ID: 5b07342ffb02
Revises: c043dccc3330
Create Date: 2023-05-16 18:24:51.495110

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5b07342ffb02'
down_revision = 'c043dccc3330'
branch_labels = None
depends_on = None

TABLE_NAME = 'subcategories'


def upgrade() -> None:
    op.create_table(
        TABLE_NAME,
        sa.Column('id', sa.Integer, primary_key=True, index=True, autoincrement=True),
        sa.Column('subcategory', sa.String(length=15), nullable=False),
        sa.Column('category_id', sa.Integer, nullable=False),
    )
    pass


def downgrade() -> None:
    op.drop_table(TABLE_NAME)
    pass
