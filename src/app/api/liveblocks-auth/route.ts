import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  const clerkUser = await currentUser();

  const {id, firsName, lastName, emailAddresses, imageURL } = clerkUser;

  // Get the current user from your database
  if (!clerkUser) redirect("/sign-in");
  const user = {
    id,
    info: {
      name: `${firsName} ${lastName}`,
      email: emailAddresses[0].emailAddress,
      avatar: imageURL,
      color: getUserColor(id),
    },
  };

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.email,
      groupIds: [],
    },
    { userInfo: user.info }
  );

  return new Response(body, { status });
}