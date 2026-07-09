"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { listDTO } from "@/lib/services/listsModels";
import { getSession } from "../authContext";

export default function Home() {
  const [userLists, setUserLists] = useState<listDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [createNewListForm, setCreateNewList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const newListTextInput = useRef(null);
  async function createNewList(listName: string, userId: string) {
    const response = await fetch("/api/lists", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: 0,
        list_name: listName,
        userId: userId,
      } as listDTO),
    });
    if (response.ok) {
      getUserLists(userId);
    }
  }

  async function getUserLists(id: string | undefined) {
    const response = await fetch("/api/lists?userId=" + id);
    if (response.ok) {
      const data = (await response.json()) as listDTO[];
      setUserLists(data);
    }
  }
  async function editList(listId: number, userId: string) {}
  async function deleteList(listId: number) {
    const response = await fetch("/api/lists", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ listId: listId, uuid: userId }),
    });
    if (response.ok) {
      getUserLists(userId);
    }
  }
  async function init() {
    const id = (await getSession()).uuid;
    setUserId(id!);
    getUserLists(id!);
  }
  useEffect(() => {
    if (loading) {
      try {
        init();
      } catch (error) {
        alert(
          "Error retrieving Data: " +
            error +
            "/n Redirecting to server landing page",
        );
        document.location.href = "/";
      } finally {
        setLoading(false);
      }
    }
  });
  if (loading) {
    return <main></main>;
  } else {
    return (
      <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
        <h1>Your Lists</h1>
        <p>Select a list to view and manage tasks.</p>
        <ul className="list-none p-0 mt-1 w-full">
          {userLists.map((list) => (
            <li key={list.id} className="m-1 w-full items-center flex">
              {!loading && (
                <span className="w-full flex">
                  <a
                    href={`/home/list?listId=${list.id}`}
                    className="btnBlue rounded px-5 py-2 m-auto flex-grow text-center"
                  >
                    {list.list_name}
                  </a>
                  <a
                    className="bg-green-700 bg-[url(/edit.png)] bg-contain px-5 py-2 rounded"
                    onClick={(e) => {
                      editList(list.id, userId);
                    }}
                  ></a>
                  <a
                    className="bg-red-800 bg-[url(/delete.png)] bg-contain px-5 py-2 rounded"
                    onClick={() => {
                      deleteList(list.id);
                    }}
                  ></a>
                </span>
              )}
            </li>
          ))}
          {!createNewListForm && (
            <li className="m-1 w-full items-center flex">
              <a
                className="rounded px-5 py-2 m-auto w-full text-center bg-transparent text-white border-dashed border-[#bbb] border-2"
                onClick={() => {
                  setCreateNewList(true);
                }}
              >
                Create a new list
              </a>
            </li>
          )}
        </ul>
        {createNewListForm && (
          <div className="flex items-center justify-center flex-wrap">
            <label
              htmlFor="listName"
              className=" basis-full rounded px-5 py-2 m-1 text-center bg-transparent text-white border-dashed border-[#bbb] border-2 block"
            >
              {error || "Enter New List's Name"}
            </label>
            <input
              autoFocus
              type="text"
              id="listName"
              placeholder="List Name"
              className="basis-full text-center m-1 mt-0 px-5 py-2 rounded bg-[#555]"
              onChange={(e) => {
                setNewListName(e.target.value);
              }}
            ></input>
            <a
              id="save"
              className=" basis-1/3 bg-green-700 m-1 px-2 py-1 rounded flex-grow text-center"
              onClick={() => {
                if (newListName.trim().length > 0) {
                  createNewList(newListName, userId);
                  setCreateNewList(false);
                } else {
                  setError("A List name is required");
                }
              }}
            >
              Create
            </a>
            <a
              id="cancel"
              className="basis-1/3 bg-red-800 m-1 px-2 py-1 rounded flex-grow text-center"
              onClick={() => {
                setCreateNewList(false);
                setNewListName("");
              }}
            >
              Cancel
            </a>
          </div>
        )}
      </main>
    );
  }
}
