"""fixed cartitem foreign key

Revision ID: a674458c5243
Revises: c25dd37fbbd6
Create Date: 2025-04-18 00:18:43.630483

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a674458c5243'
down_revision = 'c25dd37fbbd6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cart_item', schema=None) as batch_op:
        batch_op.drop_constraint('cart_item_product_id_fkey', type_='foreignkey')
        batch_op.drop_column('product_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cart_item', schema=None) as batch_op:
        batch_op.add_column(sa.Column('product_id', sa.INTEGER(), autoincrement=False, nullable=False))
        batch_op.create_foreign_key('cart_item_product_id_fkey', 'product', ['product_id'], ['id'])

    # ### end Alembic commands ###
