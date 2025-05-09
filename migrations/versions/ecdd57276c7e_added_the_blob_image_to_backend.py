"""added the blob image to backend

Revision ID: ecdd57276c7e
Revises: 5829750ccaa4
Create Date: 2025-05-03 11:21:12.642934

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ecdd57276c7e'
down_revision = '5829750ccaa4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.add_column(sa.Column('image_data', sa.LargeBinary(), nullable=True))
        batch_op.add_column(sa.Column('image_mime', sa.String(length=50), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.drop_column('image_mime')
        batch_op.drop_column('image_data')

    # ### end Alembic commands ###
