#!/usr/bin/env python3
import argparse
import logging
import os
import sys
import time

import psycopg2

if __name__ == "__main__":
    logging.info("Wait for database")

    arg_parser = argparse.ArgumentParser()
    arg_parser.add_argument("--db_host")
    arg_parser.add_argument("--db_port")
    arg_parser.add_argument("--db_user")
    arg_parser.add_argument("--db_password")
    arg_parser.add_argument("--db_name")
    arg_parser.add_argument("--timeout", type=int, default=15)

    args = arg_parser.parse_args()

    start_time = time.time()
    while (time.time() - start_time) < args.timeout:
        try:
            conn = psycopg2.connect(
                user=args.db_user or os.environ["PGUSER"],
                host=args.db_host or os.environ["PGHOST"],
                port=args.db_port or os.environ["PGPORT"],
                password=args.db_password or os.environ["PGPASSWORD"],
                dbname=args.db_name or os.environ["DEFAULTDB"],
            )
            error = ""
            break
        except psycopg2.OperationalError as e:
            error = e
        else:
            conn.close()
        time.sleep(1)
    if error:
        logging.error("Database connection failure: %s" % error)
        sys.exit(1)
